interface GitHubStats {
  stars: number;
  forks: number;
  issues: number;
  watchers: number;
  lastUpdated: string;
}

const CACHE_KEY = 'github_stats_cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function fetchGitHubStats(
  repo: string = 'udaypankhaniya/diff-check'
): Promise<GitHubStats> {
  // Check cache first
  const cached = getCachedStats();
  if (cached && Date.now() - new Date(cached.lastUpdated).getTime() < CACHE_DURATION) {
    return cached;
  }

  try {
    const response = await fetch(`https://api.github.com/repos/${repo}`, {
      headers: {
        Accept: 'application/vnd.github.v3+json',
        ...(process.env.NEXT_PUBLIC_GITHUB_TOKEN && {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
        }),
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();
    
    const stats: GitHubStats = {
      stars: data.stargazers_count || 0,
      forks: data.forks_count || 0,
      issues: data.open_issues_count || 0,
      watchers: data.watchers_count || 0,
      lastUpdated: new Date().toISOString(),
    };

    // Cache the results
    setCachedStats(stats);
    
    return stats;
  } catch (error) {
    console.error('Failed to fetch GitHub stats:', error);
    
    // Return cached data if available, otherwise default values
    return cached || {
      stars: 0,
      forks: 0,
      issues: 0,
      watchers: 0,
      lastUpdated: new Date().toISOString(),
    };
  }
}

function getCachedStats(): GitHubStats | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    return cached ? JSON.parse(cached) : null;
  } catch {
    return null;
  }
}

function setCachedStats(stats: GitHubStats): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(stats));
  } catch {
    // Ignore localStorage errors
  }
}