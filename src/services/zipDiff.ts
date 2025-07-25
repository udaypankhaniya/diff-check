import JSZip from "jszip";
import {  createTwoFilesPatch } from "diff";

export type FileEntry = {
  path: string;
  isDir: boolean;
  content?: string; // Only for text files
  size?: number;
};

export type DiffResult = {
  added: string[];
  removed: string[];
  modified: string[];
  unchanged: string[];
  diffs: Record<string, string>; // path -> unified diff for modified files
  stats: {
    totalFiles: number;
    addedCount: number;
    removedCount: number;
    modifiedCount: number;
    unchangedCount: number;
  };
};

const TEXT_FILE_EXTENSIONS = [
  ".txt", ".md", ".json", ".html", ".js", ".ts", ".css", ".tsx", ".jsx",
  ".py", ".java", ".cpp", ".c", ".h", ".php", ".rb", ".go", ".rs", ".swift",
  ".kt", ".scala", ".sh", ".bat", ".ps1", ".yml", ".yaml", ".xml", ".sql",
  ".dockerfile", ".gitignore", ".env", ".config", ".ini", ".toml", ".lock"
];

function normalizePath(path: string): string {
  // More robust path normalization
  return path
    .replace(/\\/g, "/") // Convert backslashes to forward slashes
    .replace(/\/+/g, "/") // Replace multiple slashes with single slash
    .replace(/^\/+/, "") // Remove leading slashes
    .replace(/\/+$/, "") // Remove trailing slashes
    .trim(); // Remove whitespace
}

function isTextFile(filename: string): boolean {
  const lowerFilename = filename.toLowerCase();
  return TEXT_FILE_EXTENSIONS.some((ext) => lowerFilename.endsWith(ext)) ||
         !filename.includes('.'); // Files without extension are often text
}

export async function extractZipEntries(
  buffer: ArrayBuffer
): Promise<FileEntry[]> {
  try {
    const zip = await JSZip.loadAsync(buffer);
    const entries: FileEntry[] = [];

    for (const [path, entry] of Object.entries(zip.files)) {
      try {
        const normalizedPath = normalizePath(path);
        
        // Skip empty paths or root directory
        if (!normalizedPath || normalizedPath === "/") continue;

        if (entry.dir) {
          entries.push({ 
            path: normalizedPath, 
            isDir: true,
            size: 0
          });
        } else {
          let content: string | undefined = undefined;
      
          
          // Only read content for text files under 1MB
          if (isTextFile(normalizedPath) ) {
            try {
              content = await entry.async("text");
            } catch (error) {
              console.warn(`Failed to read text content for ${normalizedPath}:`, error);
            }
          }
          
          entries.push({ 
            path: normalizedPath, 
            isDir: false, 
            content,
            
          });
        }
      } catch (error) {
        console.warn(`Failed to process file ${path}:`, error);
      }
    }

    return entries.sort((a, b) => a.path.localeCompare(b.path));
  } catch (error) {
    throw new Error(
      `Failed to load ZIP file: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}

export function compareZipEntries(
  left: FileEntry[],
  right: FileEntry[]
): DiffResult {
  // Create maps with normalized paths for faster lookup
  const leftMap = new Map(left.map((f) => [f.path, f]));
  const rightMap = new Map(right.map((f) => [f.path, f]));

  const added: string[] = [];
  const removed: string[] = [];
  const modified: string[] = [];
  const unchanged: string[] = [];
  const diffs: Record<string, string> = {};

  // Get all unique paths from both ZIPs
  const allPaths = new Set([...leftMap.keys(), ...rightMap.keys()]);

  for (const path of allPaths) {
    const leftEntry = leftMap.get(path);
    const rightEntry = rightMap.get(path);

    if (!leftEntry && rightEntry) {
      // File exists only in right ZIP (added)
      added.push(path);
    } else if (leftEntry && !rightEntry) {
      // File exists only in left ZIP (removed)
      removed.push(path);
    } else if (leftEntry && rightEntry) {
      // File exists in both ZIPs
      if (leftEntry.isDir !== rightEntry.isDir) {
        // Type changed (file <-> directory)
        modified.push(path);
        if (isTextFile(path)) {
          diffs[path] = createTwoFilesPatch(
            path,
            path,
            leftEntry.content || "",
            rightEntry.content || "",
            "ZIP 1",
            "ZIP 2"
          );
        }
      } else if (!leftEntry.isDir && !rightEntry.isDir) {
        // Both are files - compare content
        if (isTextFile(path) && leftEntry.content !== undefined && rightEntry.content !== undefined) {
          if (leftEntry.content !== rightEntry.content) {
            modified.push(path);
            diffs[path] = createTwoFilesPatch(
              path,
              path,
              leftEntry.content,
              rightEntry.content,
              "ZIP 1",
              "ZIP 2"
            );
          } else {
            unchanged.push(path);
          }
        } else if (leftEntry.size !== rightEntry.size) {
          // For binary files, compare by size
          modified.push(path);
        } else {
          unchanged.push(path);
        }
      } else {
        // Both are directories
        unchanged.push(path);
      }
    }
  }

  const stats = {
    totalFiles: allPaths.size,
    addedCount: added.length,
    removedCount: removed.length,
    modifiedCount: modified.length,
    unchangedCount: unchanged.length,
  };

  return { 
    added: added.sort(), 
    removed: removed.sort(), 
    modified: modified.sort(), 
    unchanged: unchanged.sort(), 
    diffs, 
    stats 
  };
}