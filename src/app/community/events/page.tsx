'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/dashboard-layout';
import {
  Calendar,
  ArrowLeft,
  Plus,
  Loader2,
  MapPin,
  Clock,
  Users,
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
  CheckCircle,
  Video,
  Globe,
  Building,
  CalendarDays,
  Bell,
  Share2,
  Heart,
} from 'lucide-react';

// Types
interface CommunityEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  locationType: 'in-person' | 'online' | 'hybrid';
  category: 'worship' | 'study' | 'fellowship' | 'outreach' | 'prayer' | 'conference' | 'other';
  attendees: number;
  maxAttendees?: number;
  isAttending: boolean;
  isInterested: boolean;
  organizer: string;
  organizerType: 'church' | 'group' | 'user';
  imageUrl?: string;
  meetingLink?: string;
}

// Mock data
const MOCK_EVENTS: CommunityEvent[] = [
  {
    id: '1',
    title: 'Weekly Prayer Meeting',
    description: 'Join us for our weekly prayer meeting where we lift up our community, families, and world in prayer.',
    date: '2026-01-28',
    startTime: '19:00',
    endTime: '20:30',
    location: 'Main Sanctuary',
    locationType: 'hybrid',
    category: 'prayer',
    attendees: 45,
    maxAttendees: 100,
    isAttending: true,
    isInterested: false,
    organizer: 'Grace Community Church',
    organizerType: 'church',
  },
  {
    id: '2',
    title: 'Bible Study: Book of Romans',
    description: 'Deep dive into the book of Romans. This week we will cover chapters 5-6 on grace and sanctification.',
    date: '2026-01-29',
    startTime: '18:30',
    endTime: '20:00',
    location: 'Fellowship Hall',
    locationType: 'in-person',
    category: 'study',
    attendees: 28,
    maxAttendees: 40,
    isAttending: false,
    isInterested: true,
    organizer: 'Bible Study Group',
    organizerType: 'group',
  },
  {
    id: '3',
    title: 'Youth Night: Worship & Games',
    description: 'A fun evening for teens with worship, games, and fellowship. Invite your friends!',
    date: '2026-01-31',
    startTime: '18:00',
    endTime: '21:00',
    location: 'Youth Center',
    locationType: 'in-person',
    category: 'fellowship',
    attendees: 67,
    isAttending: false,
    isInterested: false,
    organizer: 'Youth Ministry',
    organizerType: 'group',
  },
  {
    id: '4',
    title: 'Online Prayer & Fasting Day',
    description: 'Join believers worldwide for a day of prayer and fasting. Virtual sessions throughout the day.',
    date: '2026-02-01',
    startTime: '06:00',
    endTime: '21:00',
    location: 'Zoom',
    locationType: 'online',
    category: 'prayer',
    attendees: 234,
    isAttending: true,
    isInterested: false,
    organizer: 'Prayer Warriors',
    organizerType: 'group',
    meetingLink: 'https://zoom.us/j/example',
  },
  {
    id: '5',
    title: 'Community Outreach: Food Drive',
    description: 'Help us serve our local community by participating in our monthly food drive.',
    date: '2026-02-08',
    startTime: '09:00',
    endTime: '14:00',
    location: 'Church Parking Lot',
    locationType: 'in-person',
    category: 'outreach',
    attendees: 35,
    maxAttendees: 50,
    isAttending: false,
    isInterested: true,
    organizer: 'Community Outreach Team',
    organizerType: 'group',
  },
  {
    id: '6',
    title: 'Worship Night',
    description: 'An evening of worship and praise. Come with an expectant heart to encounter God.',
    date: '2026-02-14',
    startTime: '19:00',
    endTime: '21:00',
    location: 'Main Sanctuary',
    locationType: 'hybrid',
    category: 'worship',
    attendees: 156,
    isAttending: false,
    isInterested: false,
    organizer: 'Grace Community Church',
    organizerType: 'church',
  },
  {
    id: '7',
    title: 'Marriage Enrichment Conference',
    description: 'A weekend conference for married couples to strengthen their relationships and grow together.',
    date: '2026-02-21',
    startTime: '09:00',
    endTime: '17:00',
    location: 'Conference Center',
    locationType: 'in-person',
    category: 'conference',
    attendees: 45,
    maxAttendees: 60,
    isAttending: false,
    isInterested: false,
    organizer: 'Marriage Ministry',
    organizerType: 'group',
  },
];

const CATEGORIES = [
  { value: 'all', label: 'All Events' },
  { value: 'worship', label: 'Worship' },
  { value: 'study', label: 'Bible Study' },
  { value: 'fellowship', label: 'Fellowship' },
  { value: 'outreach', label: 'Outreach' },
  { value: 'prayer', label: 'Prayer' },
  { value: 'conference', label: 'Conference' },
  { value: 'other', label: 'Other' },
];

function CategoryBadge({ category }: { category: CommunityEvent['category'] }) {
  const config: Record<string, { bg: string; text: string; label: string }> = {
    worship: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Worship' },
    study: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Bible Study' },
    fellowship: { bg: 'bg-green-100', text: 'text-green-700', label: 'Fellowship' },
    outreach: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Outreach' },
    prayer: { bg: 'bg-rose-100', text: 'text-rose-700', label: 'Prayer' },
    conference: { bg: 'bg-indigo-100', text: 'text-indigo-700', label: 'Conference' },
    other: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Other' },
  };

  const { bg, text, label } = config[category];

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${bg} ${text}`}>
      {label}
    </span>
  );
}

function LocationBadge({ type }: { type: CommunityEvent['locationType'] }) {
  const config = {
    'in-person': { icon: Building, label: 'In Person', color: 'text-blue-600' },
    online: { icon: Video, label: 'Online', color: 'text-green-600' },
    hybrid: { icon: Globe, label: 'Hybrid', color: 'text-purple-600' },
  };

  const { icon: Icon, label, color } = config[type];

  return (
    <span className={`inline-flex items-center gap-1 text-sm ${color}`}>
      <Icon className="w-4 h-4" />
      {label}
    </span>
  );
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

function formatTime(timeStr: string): string {
  const [hours, minutes] = timeStr.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
}

function EventCard({
  event,
  onAttend,
  onInterested,
}: {
  event: CommunityEvent;
  onAttend: (id: string) => void;
  onInterested: (id: string) => void;
}) {
  const eventDate = new Date(event.date);
  const isPast = eventDate < new Date(new Date().setHours(0, 0, 0, 0));

  return (
    <div className={`bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-brand-300 hover:shadow-lg transition-all ${isPast ? 'opacity-60' : ''}`}>
      <div className="flex flex-col md:flex-row">
        {/* Date Display */}
        <div className="md:w-28 bg-gradient-to-br from-brand-500 to-brand-600 p-4 flex md:flex-col items-center justify-center text-white">
          <div className="text-center">
            <p className="text-sm font-medium opacity-90">
              {eventDate.toLocaleDateString('en-US', { month: 'short' })}
            </p>
            <p className="text-3xl font-bold">{eventDate.getDate()}</p>
            <p className="text-sm opacity-90">
              {eventDate.toLocaleDateString('en-US', { weekday: 'short' })}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <CategoryBadge category={event.category} />
                <LocationBadge type={event.locationType} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.title}</h3>
              <p className="text-gray-600 text-sm line-clamp-2 mb-4">{event.description}</p>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{formatTime(event.startTime)} - {formatTime(event.endTime)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>
                    {event.attendees} attending
                    {event.maxAttendees && ` / ${event.maxAttendees} max`}
                  </span>
                </div>
              </div>

              <p className="text-sm text-gray-400 mt-2">
                Organized by {event.organizer}
              </p>
            </div>
          </div>

          {/* Actions */}
          {!isPast && (
            <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100">
              <button
                onClick={() => onAttend(event.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  event.isAttending
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-brand-500 text-white hover:bg-brand-600'
                }`}
              >
                {event.isAttending ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Attending
                  </>
                ) : (
                  <>
                    <Calendar className="w-4 h-4" />
                    Attend
                  </>
                )}
              </button>
              <button
                onClick={() => onInterested(event.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  event.isInterested
                    ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Heart className={`w-4 h-4 ${event.isInterested ? 'fill-current' : ''}`} />
                Interested
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors ml-auto">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className="bg-white rounded-xl p-4 border border-gray-200">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-sm text-gray-500">{label}</p>
        </div>
      </div>
    </div>
  );
}

function CalendarHeader({
  currentDate,
  onPrevMonth,
  onNextMonth,
}: {
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h3 className="font-semibold text-gray-900">
        {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
      </h3>
      <div className="flex items-center gap-1">
        <button
          onClick={onPrevMonth}
          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-4 h-4 text-gray-600" />
        </button>
        <button
          onClick={onNextMonth}
          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronRight className="w-4 h-4 text-gray-600" />
        </button>
      </div>
    </div>
  );
}

function MiniCalendar({ events }: { events: CommunityEvent[] }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startingDay = firstDayOfMonth.getDay();
  const totalDays = lastDayOfMonth.getDate();

  const eventDates = events.map(e => new Date(e.date).toDateString());

  const days = [];
  for (let i = 0; i < startingDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= totalDays; i++) {
    days.push(i);
  }

  const hasEvent = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return eventDates.includes(date.toDateString());
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4">
      <CalendarHeader
        currentDate={currentDate}
        onPrevMonth={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
        onNextMonth={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
      />
      <div className="grid grid-cols-7 gap-1">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
          <div key={day} className="text-center text-xs font-medium text-gray-400 py-2">
            {day}
          </div>
        ))}
        {days.map((day, index) => (
          <div
            key={index}
            className={`
              text-center py-2 text-sm rounded-lg
              ${day === null ? '' : 'cursor-pointer hover:bg-gray-100'}
              ${isToday(day || 0) ? 'bg-brand-500 text-white hover:bg-brand-600' : ''}
              ${hasEvent(day || 0) && !isToday(day || 0) ? 'bg-brand-100 text-brand-700' : ''}
            `}
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function EventsPage() {
  const [events, setEvents] = useState<CommunityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showPastEvents, setShowPastEvents] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      setEvents(MOCK_EVENTS);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleAttend = (eventId: string) => {
    setEvents(events.map(event => {
      if (event.id === eventId) {
        return {
          ...event,
          isAttending: !event.isAttending,
          attendees: event.isAttending ? event.attendees - 1 : event.attendees + 1,
        };
      }
      return event;
    }));
  };

  const handleInterested = (eventId: string) => {
    setEvents(events.map(event => {
      if (event.id === eventId) {
        return { ...event, isInterested: !event.isInterested };
      }
      return event;
    }));
  };

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const filteredEvents = events
    .filter(e => {
      const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || e.category === selectedCategory;
      const eventDate = new Date(e.date);
      const matchesTime = showPastEvents || eventDate >= now;
      return matchesSearch && matchesCategory && matchesTime;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const upcomingCount = events.filter(e => new Date(e.date) >= now).length;
  const attendingCount = events.filter(e => e.isAttending && new Date(e.date) >= now).length;
  const totalAttendees = events.reduce((sum, e) => sum + e.attendees, 0);

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/community"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Community
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Calendar className="w-8 h-8 text-brand-500" />
                Community Events
              </h1>
              <p className="text-gray-600 mt-1">Discover and join upcoming events</p>
            </div>
            <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-500 text-white font-semibold rounded-xl hover:bg-brand-600 transition-colors shadow-lg shadow-brand-500/20">
              <Plus className="w-5 h-5" />
              Create Event
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={Calendar}
            label="Upcoming Events"
            value={upcomingCount}
            color="bg-gradient-to-br from-brand-500 to-brand-600"
          />
          <StatCard
            icon={CheckCircle}
            label="You're Attending"
            value={attendingCount}
            color="bg-gradient-to-br from-green-500 to-green-600"
          />
          <StatCard
            icon={Users}
            label="Total RSVPs"
            value={totalAttendees}
            color="bg-gradient-to-br from-purple-500 to-purple-600"
          />
          <StatCard
            icon={CalendarDays}
            label="This Week"
            value={events.filter(e => {
              const date = new Date(e.date);
              const nextWeek = new Date(now);
              nextWeek.setDate(nextWeek.getDate() + 7);
              return date >= now && date <= nextWeek;
            }).length}
            color="bg-gradient-to-br from-amber-500 to-orange-500"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search and Filters */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search events..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none"
                  />
                </div>

                {/* Category Filter */}
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-gray-400" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none bg-white"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                {/* Past Events Toggle */}
                <button
                  onClick={() => setShowPastEvents(!showPastEvents)}
                  className={`px-4 py-3 rounded-xl font-medium transition-colors whitespace-nowrap ${
                    showPastEvents
                      ? 'bg-brand-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Show Past
                </button>
              </div>
            </div>

            {/* Events List */}
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                <Calendar className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No events found</h3>
                <p className="text-gray-500 mb-4">
                  {searchQuery ? 'Try a different search term' : 'Check back later for new events!'}
                </p>
                <button className="inline-flex items-center gap-2 px-4 py-2 bg-brand-500 text-white font-medium rounded-lg hover:bg-brand-600 transition-colors">
                  <Plus className="w-4 h-4" />
                  Create Event
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredEvents.map(event => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onAttend={handleAttend}
                    onInterested={handleInterested}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Calendar */}
            <MiniCalendar events={events} />

            {/* Your Events */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Your Upcoming Events</h3>
              {events.filter(e => e.isAttending && new Date(e.date) >= now).length === 0 ? (
                <p className="text-sm text-gray-500">You have no upcoming events.</p>
              ) : (
                <div className="space-y-3">
                  {events
                    .filter(e => e.isAttending && new Date(e.date) >= now)
                    .slice(0, 3)
                    .map(event => (
                      <div key={event.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                        <div className="w-10 h-10 bg-brand-100 rounded-lg flex flex-col items-center justify-center">
                          <span className="text-xs text-brand-600 font-medium">
                            {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                          </span>
                          <span className="text-sm font-bold text-brand-700">
                            {new Date(event.date).getDate()}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">{event.title}</p>
                          <p className="text-sm text-gray-500">{formatTime(event.startTime)}</p>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Quick Info */}
            <div className="bg-gradient-to-br from-brand-50 to-teal-50 rounded-2xl p-6 border border-brand-100">
              <h3 className="font-semibold text-gray-900 mb-3">Event Types</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Building className="w-4 h-4 text-blue-600" />
                  In Person - Physical attendance
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Video className="w-4 h-4 text-green-600" />
                  Online - Virtual participation
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Globe className="w-4 h-4 text-purple-600" />
                  Hybrid - Both options available
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Create Event CTA */}
        <div className="mt-8 bg-gradient-to-r from-brand-600 to-brand-500 rounded-2xl p-8 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold mb-2">Planning an Event?</h3>
              <p className="text-brand-100">
                Create and share your event with the community.
              </p>
            </div>
            <button className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-brand-700 font-semibold rounded-xl hover:bg-brand-50 transition-colors shadow-lg">
              <Plus className="w-5 h-5" />
              Create Event
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
