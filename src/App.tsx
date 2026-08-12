import { useState } from 'react';
import { Youtube, Upload, Link, Sparkles, Loader2, Play, Download, Settings, BarChart3, Scissors, Image as ImageIcon, MessageSquare, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { cn } from './lib/utils';
import { mockClips } from './data/mockData';
import { Clip, ProcessingStage } from './types';
import { extractYouTubeId, fetchYouTubeTitle, generateClipsForYouTube, generateClipsForFile } from './utils/videoUtils';

function VideoPlayer({ clip, autoPlay = false }: { clip: Clip; autoPlay?: boolean }) {
  const [isPlaying, setIsPlaying] = useState(autoPlay);

  const startSec = clip.startSeconds || 0;
  const endSec = clip.endSeconds || (startSec + clip.duration);

  if (isPlaying) {
    if (clip.videoType === 'youtube' && clip.videoId) {
      return (
        <div className="relative w-full h-full bg-black rounded-xl overflow-hidden">
          <iframe
            src={`https://www.youtube.com/embed/${clip.videoId}?autoplay=1&start=${startSec}&end=${endSec}&rel=0&enablejsapi=1`}
            title={clip.title}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      );
    } else if (clip.videoType === 'file' && clip.fileUrl) {
      return (
        <div className="relative w-full h-full bg-black rounded-xl overflow-hidden flex items-center justify-center">
          <video
            src={`${clip.fileUrl}#t=${startSec},${endSec}`}
            controls
            autoPlay
            className="w-full h-full object-cover"
          />
        </div>
      );
    } else {
      return (
        <div className="relative w-full h-full bg-black rounded-xl overflow-hidden flex items-center justify-center">
          <video
            src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
            controls
            autoPlay
            className="w-full h-full object-cover"
          />
        </div>
      );
    }
  }

  return (
    <div className="relative w-full h-full group">
      <img src={clip.thumbnail} className="w-full h-full object-cover opacity-75 group-hover:opacity-50 transition-opacity" alt={clip.title} />
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsPlaying(true);
        }}
        className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-all cursor-pointer z-10"
      >
        <div className="w-14 h-14 bg-purple-600 group-hover:bg-purple-500 group-hover:scale-110 text-white rounded-full flex items-center justify-center shadow-lg transition-all">
          <Play className="w-6 h-6 fill-current ml-1" />
        </div>
      </button>
    </div>
  );
}

export default function App() {
  const [stage, setStage] = useState<ProcessingStage>('idle');
  const [videoUrl, setVideoUrl] = useState('');
  const [clips, setClips] = useState<Clip[]>(mockClips);
  const [selectedClip, setSelectedClip] = useState<Clip | null>(null);
  const [activeTab, setActiveTab] = useState<'clips' | 'calendar' | 'analytics'>('clips');
  const [selectedSubtitleStyle, setSelectedSubtitleStyle] = useState('MrBeast');
  const [sourceTitle, setSourceTitle] = useState<string>('Viral Content Analysis');

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const objectUrl = URL.createObjectURL(file);
      const generated = generateClipsForFile(objectUrl, file.name);
      setClips(generated);
      setSourceTitle(file.name);
      startProcessingStage();
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: { 'video/*': [] },
    multiple: false 
  });

  const handleProcess = async () => {
    if (!videoUrl.trim()) return;

    const ytId = extractYouTubeId(videoUrl);
    if (ytId) {
      const fetchedTitle = await fetchYouTubeTitle(videoUrl);
      const titleToUse = fetchedTitle || 'YouTube Video Analysis';
      setSourceTitle(titleToUse);
      const generated = generateClipsForYouTube(ytId, titleToUse);
      setClips(generated);
    } else {
      // General link fallback
      const generated = generateClipsForYouTube('dQw4w9WgXcQ', videoUrl);
      setSourceTitle(videoUrl);
      setClips(generated);
    }

    startProcessingStage();
  };

  const startProcessingStage = () => {
    setStage('downloading');
    const stages: ProcessingStage[] = ['downloading', 'transcribing', 'analyzing', 'detecting', 'generating', 'complete'];
    let current = 0;
    const interval = setInterval(() => {
      current++;
      if (current < stages.length) {
        setStage(stages[current]);
      } else {
        clearInterval(interval);
      }
    }, 1200);
  };

  const resetToHome = () => {
    setStage('idle');
    setVideoUrl('');
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-sans selection:bg-purple-500/30">
      {/* Header */}
      <nav className="border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={resetToHome}>
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">ViralClip AI</span>
          </div>

          <div className="flex items-center gap-6 text-sm font-medium text-gray-400">
            {stage === 'complete' && (
              <button
                onClick={resetToHome}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" /> Analyze New Video
              </button>
            )}
            <button 
              onClick={() => setActiveTab('clips')}
              className={cn("hover:text-white transition-colors", activeTab === 'clips' && "text-purple-400")}
            >
              Dashboard
            </button>
            <button 
              onClick={() => setActiveTab('calendar')}
              className={cn("hover:text-white transition-colors", activeTab === 'calendar' && "text-purple-400")}
            >
              Calendar
            </button>
            <button 
              onClick={() => setActiveTab('analytics')}
              className={cn("hover:text-white transition-colors", activeTab === 'analytics' && "text-purple-400")}
            >
              Analytics
            </button>
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 border-2 border-white/10" />
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {stage === 'idle' ? (
          <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="text-center space-y-4">
              <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
                Turn Long Videos Into Viral Shorts
              </h1>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                AI-powered platform to extract the most engaging moments from your podcasts and interviews automatically.
              </p>
            </div>

            <div className="bg-[#111] border border-white/10 rounded-3xl p-8 shadow-2xl">
              <div className="space-y-6">
                <div className="relative">
                  <Youtube className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                  <input 
                    type="text" 
                    placeholder="Paste YouTube Link (e.g. https://www.youtube.com/watch?v=...)"
                    className="w-full bg-black/50 border border-white/10 rounded-xl py-4 pl-12 pr-28 focus:ring-2 focus:ring-purple-500 outline-none transition-all text-sm"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleProcess()}
                  />
                  <button 
                    onClick={handleProcess}
                    disabled={!videoUrl.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-900/50 disabled:text-gray-500 disabled:cursor-not-allowed px-6 py-2 rounded-lg font-semibold transition-all cursor-pointer z-10"
                  >
                    Analyze
                  </button>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/5"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-[#111] px-2 text-gray-500">Or upload file</span>
                  </div>
                </div>

                <div 
                  {...getRootProps()} 
                  className={cn(
                    "border-2 border-dashed border-white/10 rounded-2xl p-12 text-center cursor-pointer transition-all hover:border-purple-500/50 hover:bg-purple-500/5",
                    isDragActive && "border-purple-500 bg-purple-500/10"
                  )}
                >
                  <input {...getInputProps()} />
                  <Upload className="w-10 h-10 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400 font-medium">Drag & drop your video podcast here</p>
                  <p className="text-gray-600 text-sm mt-1">MP4, MOV, up to 2GB</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-6 pt-12">
              {[
                { label: 'Viral Detection', desc: 'Identify emotional peaks' },
                { label: 'Auto Editing', desc: '9:16 vertical crop' },
                { label: 'Smart Captions', desc: 'Animated highlighting' }
              ].map((feature, i) => (
                <div key={i} className="bg-white/5 p-4 rounded-xl border border-white/5">
                  <div className="font-bold mb-1">{feature.label}</div>
                  <div className="text-sm text-gray-500">{feature.desc}</div>
                </div>
              ))}
            </div>
          </div>
        ) : stage !== 'complete' ? (
          <div className="max-w-xl mx-auto py-20 text-center space-y-8 animate-in zoom-in-95 duration-500">
            <div className="relative w-24 h-24 mx-auto">
              <Loader2 className="w-24 h-24 text-purple-500 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-purple-400" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold capitalize">{stage.replace(/([A-Z])/g, ' $1')}...</h2>
              <p className="text-gray-400">Processing <span className="text-purple-400 font-semibold">{sourceTitle}</span> for maximum virality.</p>
            </div>
            
            <div className="space-y-4">
              {['Downloading video', 'Extracting audio', 'Generating transcript', 'Detecting viral moments', 'Generating clips'].map((s, i) => {
                const stepIdx = ['downloading', 'transcribing', 'analyzing', 'detecting', 'generating'].indexOf(stage);
                const isDone = i < stepIdx;
                const isActive = i === stepIdx;
                
                return (
                  <div key={i} className="flex items-center gap-4 text-left">
                    <div className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                      isDone ? "bg-green-500" : isActive ? "bg-purple-500 animate-pulse" : "bg-white/10"
                    )}>
                      {isDone ? '✓' : i + 1}
                    </div>
                    <span className={cn(
                      "transition-colors",
                      isDone ? "text-gray-400" : isActive ? "text-white font-bold" : "text-gray-600"
                    )}>{s}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-12 gap-8 animate-in fade-in duration-1000">
            {/* Sidebar Stats */}
            <div className="col-span-12 lg:col-span-3 space-y-6">
              <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Video Analyzed</h3>
                <p className="text-base font-bold text-white truncate mb-4" title={sourceTitle}>{sourceTitle}</p>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-gray-300">Viral Potential</span>
                </div>
                <div className="flex items-center gap-2 mb-6">
                  <div className="h-1 flex-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 w-[94%]"></div>
                  </div>
                  <span className="text-xs font-mono text-green-500">94%</span>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Total Clips Generated</span>
                    <span className="font-bold">{clips.length}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Avg Viral Score</span>
                    <span className="font-bold">92/100</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-purple-500/20 rounded-2xl p-6">
                <h3 className="font-bold mb-2 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-purple-400" /> Creator Scorecard
                </h3>
                <div className="space-y-3 mt-4">
                  {[
                    { label: 'Hook Strength', score: 92 },
                    { label: 'Story Tension', score: 88 },
                    { label: 'Retention Potential', score: 95 }
                  ].map((item) => (
                    <div key={item.label} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-300">{item.label}</span>
                        <span>{item.score}/100</span>
                      </div>
                      <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500" style={{ width: `${item.score}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => alert('AI Analysis: Focus on stronger hooks in the first 3 seconds. Add punchy captions for maximum retention.')}
                  className="w-full mt-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-all cursor-pointer"
                >
                  Get Improvement Tips
                </button>
              </div>
            </div>

            {/* Main Content */}
            <div className="col-span-12 lg:col-span-9 space-y-8">
              {/* Heatmap Timeline */}
              <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold flex items-center gap-2 text-lg">
                    <BarChart3 className="w-5 h-5 text-purple-500" /> Viral Moments Heatmap
                  </h3>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-3 h-3 rounded-full bg-purple-500"></div> High Impact
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-3 h-3 rounded-full bg-white/20"></div> Context
                    </div>
                  </div>
                </div>
                <div className="relative h-24 bg-white/5 rounded-xl flex items-end px-2 gap-1 overflow-hidden">
                  {Array.from({ length: 60 }).map((_, i) => {
                    const height = Math.sin(i * 0.3) * 35 + 50 + (i % 5 === 0 ? 20 : 0);
                    const isSpike = height > 75;
                    return (
                      <div 
                        key={i} 
                        onClick={() => {
                          const matchingClip = clips[i % clips.length];
                          setSelectedClip(matchingClip);
                        }}
                        className={cn(
                          "flex-1 rounded-t-sm transition-all cursor-pointer hover:opacity-80 hover:scale-110",
                          isSpike ? "bg-purple-500" : "bg-white/20"
                        )}
                        style={{ height: `${Math.min(100, Math.max(15, height))}%` }}
                        title={`Moment at ${Math.floor(i/2)}:${(i%2)*30} - Click to preview clip`}
                      ></div>
                    );
                  })}
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-500 font-mono">
                  <span>00:00</span>
                  <span>05:00</span>
                  <span>10:00</span>
                  <span>15:00</span>
                </div>
              </div>

              {/* Clips Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {clips.map((clip) => (
                  <motion.div 
                    layoutId={clip.id}
                    key={clip.id}
                    onClick={() => setSelectedClip(clip)}
                    className="group bg-[#111] border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-500/20 transition-all cursor-pointer"
                  >
                    <div className="relative aspect-[9/16] bg-gray-900">
                      <VideoPlayer clip={clip} />

                      <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none z-20">
                        <div className="bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold text-white border border-white/10">
                          {clip.timestamp}
                        </div>
                        <div className="bg-purple-600 px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest italic shadow">
                          Viral {clip.viralScore}%
                        </div>
                      </div>

                      <div className="absolute bottom-4 left-4 right-4 flex gap-2 pointer-events-none z-20">
                        <div className="bg-green-500/20 backdrop-blur-md px-2 py-1 rounded-md text-[10px] font-bold text-green-400 border border-green-500/20">
                          Hook: {clip.hookStrength}
                        </div>
                        <div className="bg-blue-500/20 backdrop-blur-md px-2 py-1 rounded-md text-[10px] font-bold text-blue-400 border border-blue-500/20">
                          Retention: {clip.retentionScore}
                        </div>
                      </div>
                    </div>

                    <div className="p-4 space-y-1">
                      <h4 className="font-bold truncate">{clip.title}</h4>
                      <p className="text-xs text-gray-500">{clip.duration}s • {clip.predictedViews} potential views</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div className="flex justify-center pt-8">
                <button 
                  onClick={() => alert(`Downloading all ${clips.length} generated clips with full HD video, title metadata, and captions package (.zip)`)}
                  className="flex items-center gap-2 bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-gray-200 transition-all cursor-pointer"
                >
                  <Download className="w-5 h-5" /> Download Full Package (.zip)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Editor */}
        <AnimatePresence>
          {selectedClip && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-xl p-4 md:p-8 flex items-center justify-center"
              onClick={() => setSelectedClip(null)}
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="relative bg-[#0F0F0F] w-full max-w-6xl rounded-3xl overflow-hidden border border-white/10 shadow-2xl flex flex-col md:flex-row h-[90vh]"
              >
                {/* Left: Preview */}
                <div className="flex-1 bg-black relative flex items-center justify-center p-8">
                  <div className="relative aspect-[9/16] h-full max-w-full bg-gray-900 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 group">
                    <VideoPlayer clip={selectedClip} autoPlay={true} />
                    
                    {/* Animated Caption Overlay */}
                    <div className="absolute inset-x-0 bottom-[18%] text-center px-4 pointer-events-none z-30">
                      <span className="bg-yellow-400 text-black text-2xl md:text-3xl font-black uppercase italic px-4 py-1 inline-block drop-shadow-lg scale-105 rounded">
                        {selectedClip.title.split(' ')[0]}
                      </span>
                    </div>
                  </div>
                  
                  <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-40">
                    <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
                       <Sparkles className="w-4 h-4 text-purple-400" />
                       {selectedClip.videoType === 'youtube' ? 'Interactive YouTube Player' : 'Uploaded Clip Player'}
                    </div>
                    <button 
                      onClick={() => setSelectedClip(null)}
                      className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                {/* Right: Tools */}
                <div className="w-full md:w-[450px] border-l border-white/10 flex flex-col bg-[#0F0F0F]">
                  <div className="p-6 border-b border-white/10">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold">Smart Editor</h3>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => alert('Adjust timestamp range, caption timing, export quality, aspect ratio')}
                          className="p-2 hover:bg-white/5 rounded-lg transition-all text-gray-400 cursor-pointer"
                        >
                          <Settings className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button 
                        onClick={() => alert('Publishing clip directly to TikTok, Instagram Reels, and YouTube Shorts...')}
                        className="flex-1 py-2 bg-purple-600 rounded-lg text-sm font-bold hover:bg-purple-500 transition-all cursor-pointer"
                      >
                        Publish Now
                      </button>
                      <button 
                        onClick={() => alert(`Exporting clip "${selectedClip.title}" as MP4...`)}
                        className="px-4 py-2 bg-white/5 rounded-lg hover:bg-white/10 transition-all cursor-pointer"
                      >
                        <Download className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {/* Subtitle Style */}
                    <section className="space-y-4">
                      <div className="flex items-center gap-2 text-sm font-bold text-gray-400">
                        <Scissors className="w-4 h-4" /> Subtitle Presets
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        {['MrBeast', 'Hormozi', 'Minimal'].map((style) => (
                          <button 
                            key={style} 
                            onClick={() => setSelectedSubtitleStyle(style)}
                            className={cn(
                              "py-2 rounded-lg text-xs font-bold border transition-all cursor-pointer",
                              style === selectedSubtitleStyle ? "border-purple-500 bg-purple-500/10" : "border-white/10 bg-white/5 hover:bg-white/10"
                            )}
                          >
                            {style}
                          </button>
                        ))}
                      </div>
                    </section>

                    {/* AI Hooks */}
                    <section className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm font-bold text-gray-400">
                          <Link className="w-4 h-4" /> AI Viral Hooks
                        </div>
                        <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full font-bold">95 Strength</span>
                      </div>
                      <div className="space-y-2">
                        {selectedClip.hooks.map((hook, i) => (
                          <div 
                            key={i} 
                            onClick={() => alert(`Hook selected: "${hook}"`)}
                            className="group flex items-start gap-3 p-3 bg-white/5 border border-white/10 rounded-xl hover:border-purple-500/30 hover:bg-white/10 transition-all cursor-pointer"
                          >
                            <div className="mt-1 w-4 h-4 rounded-full border border-purple-500/50 flex-shrink-0 group-hover:bg-purple-500/30" />
                            <p className="text-sm text-gray-300 leading-relaxed">{hook}</p>
                          </div>
                        ))}
                      </div>
                    </section>

                    {/* Thumbnails */}
                    <section className="space-y-4">
                      <div className="flex items-center gap-2 text-sm font-bold text-gray-400">
                        <ImageIcon className="w-4 h-4" /> Thumbnail Options
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {[1, 2, 3].map((i) => (
                          <div 
                            key={i} 
                            onClick={() => alert(`Thumbnail variant #${i} selected for clip`)}
                            className="relative aspect-square rounded-lg overflow-hidden bg-gray-900 border border-white/10 group cursor-pointer hover:border-purple-500/50"
                          >
                            <img src={selectedClip.thumbnail} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                            {i === 1 && <div className="absolute inset-0 ring-2 ring-purple-500 ring-inset" />}
                          </div>
                        ))}
                      </div>
                    </section>

                    {/* Engagement */}
                    <section className="space-y-4">
                      <div className="flex items-center gap-2 text-sm font-bold text-gray-400">
                        <MessageSquare className="w-4 h-4" /> Comment Bait
                      </div>
                      {selectedClip.engagementPrompts.map((prompt, i) => (
                        <div key={i} className="p-3 bg-white/5 border border-white/5 rounded-xl text-sm italic text-gray-400">
                          "{prompt}"
                        </div>
                      ))}
                    </section>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content Calendar Tab View Mock */}
        {activeTab === 'calendar' && (
          <div className="py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="bg-[#111] border border-white/10 rounded-3xl p-8">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h2 className="text-2xl font-bold">Suggested Posting Schedule</h2>
                    <p className="text-gray-400">Optimized for maximum reach based on your audience niche.</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => alert('Syncing calendar to TikTok scheduler...')}
                      className="px-4 py-2 bg-purple-600 rounded-lg text-sm font-bold hover:bg-purple-500 transition-all cursor-pointer"
                    >
                      Sync to TikTok
                    </button>
                    <button 
                      onClick={() => alert('Exporting posting calendar as PDF...')}
                      className="px-4 py-2 bg-white/10 rounded-lg text-sm font-bold hover:bg-white/20 transition-all cursor-pointer"
                    >
                      Export PDF
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-7 gap-4">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                    <div key={day} className="space-y-4">
                      <div className="text-center text-sm font-bold text-gray-500 uppercase">{day}</div>
                      <button 
                        onClick={() => i < 5 && alert(`${day}: Scheduled to post Clip #${i+1} at 10:00 AM`)}
                        className={cn(
                          "w-full h-48 rounded-2xl border flex flex-col items-center justify-center p-4 text-center gap-2 transition-all",
                          i < 5 ? "bg-purple-500/5 border-purple-500/20 hover:bg-purple-500/10 cursor-pointer" : "bg-white/5 border-white/10"
                        )}
                      >
                        {i < 5 ? (
                          <>
                            <div className="w-12 h-12 rounded-lg bg-gray-900 border border-white/10 overflow-hidden">
                              {clips[i] && <img src={clips[i].thumbnail} className="w-full h-full object-cover" />}
                            </div>
                            <div className="text-[10px] font-bold">Clip #{i+1}</div>
                            <div className="text-[9px] text-gray-500">10:00 AM</div>
                          </>
                        ) : (
                          <div className="text-xs text-gray-600">Rest Day</div>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
             </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 opacity-50 cursor-pointer" onClick={resetToHome}>
            <Sparkles className="w-5 h-5" />
            <span className="font-bold">ViralClip AI</span>
          </div>
          <div className="flex gap-8 text-sm text-gray-500">
            <button onClick={() => alert('Privacy Policy')} className="hover:text-white transition-colors cursor-pointer">Privacy</button>
            <button onClick={() => alert('Terms of Service')} className="hover:text-white transition-colors cursor-pointer">Terms</button>
            <button onClick={() => alert('API Documentation')} className="hover:text-white transition-colors cursor-pointer">API</button>
            <button onClick={() => alert('Contact Support')} className="hover:text-white transition-colors cursor-pointer">Contact</button>
          </div>
          <div className="text-xs text-gray-600">
            © 2024 ViralClip AI. All rights reserved. Built for professional creators.
          </div>
        </div>
      </footer>
    </div>
  );
}
