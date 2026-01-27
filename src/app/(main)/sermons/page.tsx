'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Clock,
  Calendar,
  User,
  Filter,
  ChevronDown,
  Search,
  Loader2,
  Bookmark,
  Share2,
  List,
  Grid,
  SkipBack,
  SkipForward,
  Mic,
  Video,
  Headphones,
} from 'lucide-react';
import { clsx } from 'clsx';

// Sermon types
interface Sermon {
  id: string;
  title: string;
  description: string;
  speaker: string;
  speakerTitle?: string;
  speakerAvatar?: string;
  series?: string;
  date: string;
  duration: number; // in seconds
  mediaType: 'audio' | 'video';
  mediaUrl: string;
  thumbnailUrl?: string;
  views: number;
  isBookmarked: boolean;
}

interface SermonSeries {
  id: string;
  name: string;
  description: string;
  sermonCount: number;
  imageUrl?: string;
}

// Mock data
const MOCK_SERMONS: Sermon[] = [
  {
    id: '1',
    title: 'Finding Peace in the Storm',
    description: 'In this message, we explore how to find God\'s peace even in the midst of life\'s most challenging circumstances.',
    speaker: 'Pastor John Smith',
    speakerTitle: 'Senior Pastor',
    series: 'Faith in Difficult Times',
    date: '2024-01-21',
    duration: 2700,
    mediaType: 'video',
    mediaUrl: '/sermons/peace-in-storm.mp4',
    views: 1234,
    isBookmarked: false,
  },
  {
    id: '2',
    title: 'The Power of Prayer',
    description: 'Discover the transformative power of prayer and how it can change your life and the lives of those around you.',
    speaker: 'Dr. Sarah Johnson',
    speakerTitle: 'Teaching Pastor',
    series: 'Prayer Foundations',
    date: '2024-01-14',
    duration: 2400,
    mediaType: 'audio',
    mediaUrl: '/sermons/power-of-prayer.mp3',
    views: 892,
    isBookmarked: true,
  },
  {
    id: '3',
    title: 'Walking in Faith',
    description: 'Learn what it means to truly walk by faith and not by sight in your everyday life.',
    speaker: 'Pastor John Smith',
    speakerTitle: 'Senior Pastor',
    series: 'Faith in Difficult Times',
    date: '2024-01-07',
    duration: 3000,
    mediaType: 'video',
    mediaUrl: '/sermons/walking-in-faith.mp4',
    views: 2156,
    isBookmarked: false,
  },
  {
    id: '4',
    title: 'The Heart of Worship',
    description: 'Understanding what true worship means and how we can worship God in spirit and truth.',
    speaker: 'Pastor Mike Williams',
    speakerTitle: 'Worship Pastor',
    series: 'Worship Series',
    date: '2023-12-31',
    duration: 2100,
    mediaType: 'audio',
    mediaUrl: '/sermons/heart-of-worship.mp3',
    views: 756,
    isBookmarked: false,
  },
  {
    id: '5',
    title: 'Grace That Transforms',
    description: 'Experience the life-changing power of God\'s grace and how it transforms us from the inside out.',
    speaker: 'Dr. Sarah Johnson',
    speakerTitle: 'Teaching Pastor',
    date: '2023-12-24',
    duration: 2850,
    mediaType: 'video',
    mediaUrl: '/sermons/grace-transforms.mp4',
    views: 3421,
    isBookmarked: true,
  },
];

const MOCK_SERIES: SermonSeries[] = [
  { id: '1', name: 'Faith in Difficult Times', description: 'A series on trusting God through challenges', sermonCount: 6 },
  { id: '2', name: 'Prayer Foundations', description: 'Building a strong prayer life', sermonCount: 4 },
  { id: '3', name: 'Worship Series', description: 'Exploring the heart of worship', sermonCount: 3 },
];

const SPEAKERS = ['All Speakers', 'Pastor John Smith', 'Dr. Sarah Johnson', 'Pastor Mike Williams'];

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins} min`;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function SermonCard({
  sermon,
  onPlay,
  onBookmark,
  isPlaying,
  viewMode,
}: {
  sermon: Sermon;
  onPlay: (id: string) => void;
  onBookmark: (id: string) => void;
  isPlaying: boolean;
  viewMode: 'grid' | 'list';
}) {
  if (viewMode === 'list') {
    return (
      <div className={clsx(
        'bg-white rounded-xl border p-4 hover:shadow-md transition-all',
        isPlaying ? 'border-brand-300 ring-2 ring-brand-100' : 'border-gray-200 hover:border-gray-300'
      )}>
        <div className="flex items-center gap-4">
          <button
            onClick={() => onPlay(sermon.id)}
            className={clsx(
              'w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors',
              isPlaying
                ? 'bg-brand-500 text-white'
                : sermon.mediaType === 'video'
                  ? 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                  : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
            )}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : sermon.mediaType === 'video' ? (
              <Video className="w-5 h-5" />
            ) : (
              <Headphones className="w-5 h-5" />
            )}
          </button>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">{sermon.title}</h3>
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <span>{sermon.speaker}</span>
              <span>-</span>
              <span>{formatDate(sermon.date)}</span>
              <span>-</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {formatDuration(sermon.duration)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onBookmark(sermon.id);
              }}
              className={clsx(
                'p-2 rounded-lg transition-colors',
                sermon.isBookmarked
                  ? 'text-brand-600 bg-brand-50 hover:bg-brand-100'
                  : 'text-gray-400 hover:text-brand-600 hover:bg-gray-100'
              )}
            >
              <Bookmark className={clsx('w-5 h-5', sermon.isBookmarked && 'fill-current')} />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={clsx(
      'bg-white rounded-2xl border overflow-hidden hover:shadow-lg transition-all group',
      isPlaying ? 'border-brand-300 ring-2 ring-brand-100' : 'border-gray-200 hover:border-gray-300'
    )}>
      {/* Thumbnail/Play Button */}
      <div className="relative h-40 bg-gradient-to-br from-brand-500 to-brand-600">
        <div className="absolute inset-0 flex items-center justify-center">
          {sermon.mediaType === 'video' ? (
            <Video className="w-12 h-12 text-white/30" />
          ) : (
            <Mic className="w-12 h-12 text-white/30" />
          )}
        </div>
        <button
          onClick={() => onPlay(sermon.id)}
          className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/20 transition-colors"
        >
          <div className={clsx(
            'w-14 h-14 rounded-full flex items-center justify-center transition-transform group-hover:scale-110',
            isPlaying ? 'bg-brand-500' : 'bg-white/90'
          )}>
            {isPlaying ? (
              <Pause className="w-6 h-6 text-white" />
            ) : (
              <Play className="w-6 h-6 text-brand-600 ml-1" />
            )}
          </div>
        </button>
        <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded-lg">
          {formatDuration(sermon.duration)}
        </div>
        <div className={clsx(
          'absolute top-3 left-3 text-xs px-2 py-1 rounded-lg',
          sermon.mediaType === 'video' ? 'bg-purple-500 text-white' : 'bg-blue-500 text-white'
        )}>
          {sermon.mediaType === 'video' ? 'Video' : 'Audio'}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-gray-900 mb-1 line-clamp-1 group-hover:text-brand-700 transition-colors">
          {sermon.title}
        </h3>
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">{sermon.description}</p>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-gray-500">
            <User className="w-4 h-4" />
            <span className="truncate">{sermon.speaker}</span>
          </div>
          <span className="text-gray-400">{formatDate(sermon.date)}</span>
        </div>

        {sermon.series && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
              {sermon.series}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function MiniPlayer({
  sermon,
  isPlaying,
  onPlayPause,
  onClose,
}: {
  sermon: Sermon;
  isPlaying: boolean;
  onPlayPause: () => void;
  onClose: () => void;
}) {
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);

  // Simulate playback progress
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setProgress(prev => (prev >= 100 ? 0 : prev + 0.5));
      }, sermon.duration / 200);
      return () => clearInterval(interval);
    }
  }, [isPlaying, sermon.duration]);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      {/* Progress bar */}
      <div className="h-1 bg-gray-200">
        <div
          className="h-full bg-brand-500 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center gap-4">
          {/* Sermon info */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className={clsx(
              'w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0',
              sermon.mediaType === 'video' ? 'bg-purple-100' : 'bg-blue-100'
            )}>
              {sermon.mediaType === 'video' ? (
                <Video className="w-6 h-6 text-purple-600" />
              ) : (
                <Headphones className="w-6 h-6 text-blue-600" />
              )}
            </div>
            <div className="min-w-0">
              <p className="font-medium text-gray-900 truncate">{sermon.title}</p>
              <p className="text-sm text-gray-500 truncate">{sermon.speaker}</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
              <SkipBack className="w-5 h-5" />
            </button>
            <button
              onClick={onPlayPause}
              className="p-3 bg-brand-500 text-white rounded-full hover:bg-brand-600 transition-colors"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
              <SkipForward className="w-5 h-5" />
            </button>
          </div>

          {/* Volume and close */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <span className="sr-only">Close player</span>
              &times;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SermonsPage() {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpeaker, setSelectedSpeaker] = useState('All Speakers');
  const [selectedSeries, setSelectedSeries] = useState('All Series');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    fetchSermons();
  }, []);

  async function fetchSermons() {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setSermons(MOCK_SERMONS);
    setLoading(false);
  }

  const handlePlay = (sermonId: string) => {
    if (currentlyPlaying === sermonId) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentlyPlaying(sermonId);
      setIsPlaying(true);
    }
  };

  const handleBookmark = (sermonId: string) => {
    setSermons(sermons.map(s => {
      if (s.id === sermonId) {
        return { ...s, isBookmarked: !s.isBookmarked };
      }
      return s;
    }));
  };

  const handleClosePlayer = () => {
    setCurrentlyPlaying(null);
    setIsPlaying(false);
  };

  // Filter sermons
  const filteredSermons = sermons.filter(s => {
    const matchesSearch = searchQuery === '' ||
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.speaker.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpeaker = selectedSpeaker === 'All Speakers' || s.speaker === selectedSpeaker;
    const matchesSeries = selectedSeries === 'All Series' || s.series === selectedSeries;
    return matchesSearch && matchesSpeaker && matchesSeries;
  });

  const currentSermon = sermons.find(s => s.id === currentlyPlaying);

  return (
    <DashboardLayout>
      <div className={clsx('max-w-7xl mx-auto', currentlyPlaying && 'pb-24')}>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Mic className="w-8 h-8 text-brand-500" />
              Sermons
            </h1>
            <p className="text-gray-600 mt-1">Listen to messages from our pastors and teachers</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={clsx(
                'p-2 rounded-lg transition-colors',
                viewMode === 'grid' ? 'bg-brand-100 text-brand-700' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
              )}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={clsx(
                'p-2 rounded-lg transition-colors',
                viewMode === 'list' ? 'bg-brand-100 text-brand-700' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
              )}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search sermons..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-3">
              <select
                value={selectedSpeaker}
                onChange={(e) => setSelectedSpeaker(e.target.value)}
                className="px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none bg-white"
              >
                {SPEAKERS.map(speaker => (
                  <option key={speaker} value={speaker}>{speaker}</option>
                ))}
              </select>
              <select
                value={selectedSeries}
                onChange={(e) => setSelectedSeries(e.target.value)}
                className="px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none bg-white"
              >
                <option value="All Series">All Series</option>
                {MOCK_SERIES.map(series => (
                  <option key={series.id} value={series.name}>{series.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Sermons Grid/List */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
          </div>
        ) : filteredSermons.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <Mic className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No sermons found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your search or filters</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedSpeaker('All Speakers');
                setSelectedSeries('All Series');
              }}
              className="text-brand-600 font-medium hover:text-brand-700"
            >
              Clear filters
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSermons.map(sermon => (
              <SermonCard
                key={sermon.id}
                sermon={sermon}
                onPlay={handlePlay}
                onBookmark={handleBookmark}
                isPlaying={currentlyPlaying === sermon.id && isPlaying}
                viewMode={viewMode}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredSermons.map(sermon => (
              <SermonCard
                key={sermon.id}
                sermon={sermon}
                onPlay={handlePlay}
                onBookmark={handleBookmark}
                isPlaying={currentlyPlaying === sermon.id && isPlaying}
                viewMode={viewMode}
              />
            ))}
          </div>
        )}

        {/* Mini Player */}
        {currentSermon && (
          <MiniPlayer
            sermon={currentSermon}
            isPlaying={isPlaying}
            onPlayPause={() => setIsPlaying(!isPlaying)}
            onClose={handleClosePlayer}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
