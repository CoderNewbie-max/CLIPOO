import { Clip } from '../types';

export function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  
  // Standard watch URL: youtube.com/watch?v=ID
  const watchMatch = trimmed.match(/(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/);
  if (watchMatch) return watchMatch[1];
  
  // Short URL: youtu.be/ID
  const shortMatch = trimmed.match(/(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (shortMatch) return shortMatch[1];

  // Shorts URL: youtube.com/shorts/ID
  const shortsMatch = trimmed.match(/(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/);
  if (shortsMatch) return shortsMatch[1];

  // Embed URL: youtube.com/embed/ID
  const embedMatch = trimmed.match(/(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
  if (embedMatch) return embedMatch[1];

  // Live URL: youtube.com/live/ID
  const liveMatch = trimmed.match(/(?:youtube\.com\/live\/)([a-zA-Z0-9_-]{11})/);
  if (liveMatch) return liveMatch[1];

  // Direct 11 character ID check
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  return null;
}

export async function fetchYouTubeTitle(url: string): Promise<string | null> {
  try {
    const res = await fetch(`https://noembed.com/embed?url=${encodeURIComponent(url)}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.title || null;
  } catch {
    return null;
  }
}

export function timestampToSeconds(ts: string): number {
  const parts = ts.split(':').map(Number);
  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  } else if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }
  return 0;
}

export function generateClipsForYouTube(videoId: string, mainTitle?: string): Clip[] {
  const baseTitle = mainTitle || 'YouTube Highlight';
  const thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  return [
    {
      id: 'yt-1',
      timestamp: '00:45',
      startSeconds: 45,
      endSeconds: 97,
      duration: 52,
      viralScore: 95,
      hookStrength: 94,
      retentionScore: 96,
      predictedViews: '250k-750k',
      title: `${baseTitle}: Key Takeaway #1`,
      transcript: 'The single most critical insight from this segment that changes how you approach the problem.',
      niche: 'Education / Tech',
      confidence: 94,
      thumbnail,
      tags: ['#viral', '#trending', '#mustwatch'],
      hooks: [
        'You won\'t believe this part',
        'The #1 mistake people make',
        'Why this changes everything'
      ],
      engagementPrompts: ['What are your thoughts on this point?', 'Comment your opinion below!'],
      videoId,
      videoType: 'youtube'
    },
    {
      id: 'yt-2',
      timestamp: '02:15',
      startSeconds: 135,
      endSeconds: 180,
      duration: 45,
      viralScore: 91,
      hookStrength: 92,
      retentionScore: 89,
      predictedViews: '150k-400k',
      title: `${baseTitle}: The Turnaround Moment`,
      transcript: 'When everything shifted and we realized the solution was right in front of us the whole time.',
      niche: 'Podcast / Insight',
      confidence: 91,
      thumbnail,
      tags: ['#mindset', '#breakthrough', '#inspiration'],
      hooks: [
        'This shifted my entire perspective',
        'Nobody talks about this secret',
        'How to solve this in 30 seconds'
      ],
      engagementPrompts: ['Have you ever tried this?', 'Share with someone who needs this!'],
      videoId,
      videoType: 'youtube'
    },
    {
      id: 'yt-3',
      timestamp: '04:30',
      startSeconds: 270,
      endSeconds: 328,
      duration: 58,
      viralScore: 98,
      hookStrength: 97,
      retentionScore: 98,
      predictedViews: '600k-1.5M',
      title: `${baseTitle}: Peak Moment`,
      transcript: 'This is the exact strategy used to achieve 10x growth without spending extra effort.',
      niche: 'Growth & Success',
      confidence: 97,
      thumbnail,
      tags: ['#growth', '#strategy', '#success'],
      hooks: [
        'The secret formula revealed',
        'Stop doing it the old way',
        'This 1 change doubles results'
      ],
      engagementPrompts: ['Ready to try this strategy?', 'Drop a 🔥 if you agree!'],
      videoId,
      videoType: 'youtube'
    },
    {
      id: 'yt-4',
      timestamp: '07:10',
      startSeconds: 430,
      endSeconds: 475,
      duration: 45,
      viralScore: 88,
      hookStrength: 87,
      retentionScore: 89,
      predictedViews: '90k-250k',
      title: `${baseTitle}: Unexpected Twist`,
      transcript: 'Most people overlook this subtle detail, but it makes all the difference in execution.',
      niche: 'Tips & Tricks',
      confidence: 88,
      thumbnail,
      tags: ['#hacks', '#protips', '#learn'],
      hooks: [
        'Did you know this trick?',
        'The hidden secret uncovered',
        'Save this before you forget'
      ],
      engagementPrompts: ['Did this surprise you?', 'Tag a friend!'],
      videoId,
      videoType: 'youtube'
    },
    {
      id: 'yt-5',
      timestamp: '10:00',
      startSeconds: 600,
      endSeconds: 650,
      duration: 50,
      viralScore: 93,
      hookStrength: 91,
      retentionScore: 95,
      predictedViews: '200k-500k',
      title: `${baseTitle}: Masterclass Insight`,
      transcript: 'Here is the step-by-step framework to master this process in record time.',
      niche: 'Tutorial / Guide',
      confidence: 93,
      thumbnail,
      tags: ['#masterclass', '#guide', '#skills'],
      hooks: [
        'Master this in 3 easy steps',
        'The ultimate roadmap',
        'Why experts recommend this'
      ],
      engagementPrompts: ['Which step is hardest for you?', 'Bookmark this clip!'],
      videoId,
      videoType: 'youtube'
    },
    {
      id: 'yt-6',
      timestamp: '13:20',
      startSeconds: 800,
      endSeconds: 855,
      duration: 55,
      viralScore: 96,
      hookStrength: 95,
      retentionScore: 97,
      predictedViews: '400k-1M',
      title: `${baseTitle}: Final Conclusion`,
      transcript: 'To sum it all up, focusing on this one core principle is what guarantees long-term success.',
      niche: 'Motivation / Mindset',
      confidence: 95,
      thumbnail,
      tags: ['#conclusion', '#truth', '#action'],
      hooks: [
        'The final key to success',
        'Do not close this video yet',
        'The truth no one tells you'
      ],
      engagementPrompts: ['Will you apply this today?', 'Let us know in the comments!'],
      videoId,
      videoType: 'youtube'
    }
  ];
}

export function generateClipsForFile(fileUrl: string, fileName: string): Clip[] {
  const cleanName = fileName.replace(/\.[^/.]+$/, "");
  const defaultThumb = 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&q=80&w=400';

  return [
    {
      id: 'file-1',
      timestamp: '00:15',
      startSeconds: 15,
      endSeconds: 65,
      duration: 50,
      viralScore: 94,
      hookStrength: 92,
      retentionScore: 95,
      predictedViews: '200k-600k',
      title: `${cleanName} - Highlight 1`,
      transcript: 'Extracted viral segment from your uploaded video file.',
      niche: 'Uploaded Content',
      confidence: 93,
      thumbnail: defaultThumb,
      tags: ['#uploadedvideo', '#viralclip', '#content'],
      hooks: [
        'Best part of this video',
        'Watch this section carefully',
        'The top moment'
      ],
      engagementPrompts: ['What do you think of this moment?'],
      fileUrl,
      videoType: 'file'
    },
    {
      id: 'file-2',
      timestamp: '01:30',
      startSeconds: 90,
      endSeconds: 135,
      duration: 45,
      viralScore: 90,
      hookStrength: 89,
      retentionScore: 91,
      predictedViews: '100k-350k',
      title: `${cleanName} - Highlight 2`,
      transcript: 'Another high engagement moment automatically trimmed by AI.',
      niche: 'Uploaded Content',
      confidence: 90,
      thumbnail: defaultThumb,
      tags: ['#highlights', '#shorts', '#reels'],
      hooks: [
        'You need to see this',
        'Unbelievable clip',
        'Check this out'
      ],
      engagementPrompts: ['Rate this clip 1-10!'],
      fileUrl,
      videoType: 'file'
    },
    {
      id: 'file-3',
      timestamp: '03:10',
      startSeconds: 190,
      endSeconds: 245,
      duration: 55,
      viralScore: 97,
      hookStrength: 96,
      retentionScore: 98,
      predictedViews: '500k-1.2M',
      title: `${cleanName} - Peak Engagement`,
      transcript: 'The highest scoring hook and retention segment in your uploaded file.',
      niche: 'Uploaded Content',
      confidence: 96,
      thumbnail: defaultThumb,
      tags: ['#viral', '#trending', '#shorts'],
      hooks: [
        'The most viral 50 seconds',
        'Save this clip',
        'Insane insight here'
      ],
      engagementPrompts: ['Share with your audience!'],
      fileUrl,
      videoType: 'file'
    }
  ];
}
