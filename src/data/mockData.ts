import { Clip } from '../types';

export const mockClips: Clip[] = [
  {
    id: '1',
    timestamp: '00:45',
    duration: 52,
    viralScore: 92,
    hookStrength: 88,
    retentionScore: 94,
    predictedViews: '120k-500k',
    title: 'The Discipline Secret',
    transcript: 'Consistency is actually the only thing that separates the winners from the losers. Most people think it is talent, but it is actually just showing up every single day when you do not feel like it.',
    niche: 'Motivational',
    confidence: 91,
    thumbnail: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400',
    tags: ['#discipline', '#success', '#mindset'],
    hooks: [
      'Why 95% of people fail at consistency',
      'Nobody teaches this discipline rule',
      'This habit separates winners from everyone else'
    ],
    engagementPrompts: ['Do you agree with this?', 'How many days have you been consistent?']
  },
  {
    id: '2',
    timestamp: '02:35',
    viralScore: 88,
    hookStrength: 95,
    retentionScore: 82,
    duration: 45,
    predictedViews: '80k-200k',
    title: 'The Truth About Scaling',
    transcript: 'Scaling a business is not about adding more features, it is about removing the friction for your users. If you can make it easier to say yes, you win.',
    niche: 'Finance',
    confidence: 85,
    thumbnail: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=400',
    tags: ['#business', '#scaling', '#finance'],
    hooks: [
      'The scaling lie you were told',
      'Stop adding features to your app',
      'How to win at business in 2024'
    ],
    engagementPrompts: ['What friction are you facing?', 'Agree or disagree?']
  },
  {
    id: '3',
    timestamp: '05:12',
    viralScore: 96,
    hookStrength: 92,
    retentionScore: 98,
    duration: 58,
    predictedViews: '500k-1.2M',
    title: 'The Future of AI',
    transcript: 'AI is not going to replace humans, but humans using AI will replace humans who do not. It is the biggest shift since the industrial revolution.',
    niche: 'Educational',
    confidence: 94,
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=400',
    tags: ['#ai', '#future', '#technology'],
    hooks: [
      'The AI revolution is here',
      'Why you should be worried about AI',
      'How to stay relevant in the age of AI'
    ],
    engagementPrompts: ['Are you using AI yet?', 'What is your favorite AI tool?']
  }
];
