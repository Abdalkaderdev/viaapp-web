'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { api } from '@/lib/api';
import {
  Church,
  Search,
  Users,
  MapPin,
  Calendar,
  CheckCircle,
  Loader2,
  AlertCircle,
  LogOut,
  Plus,
  CheckCircle2,
} from 'lucide-react';
import type { UserChurch, Church as ChurchType } from '@viaapp/shared';

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function ChurchPage() {
  const [myChurch, setMyChurch] = useState<UserChurch | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ChurchType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [memberCount, setMemberCount] = useState(0);
  const [eventCount, setEventCount] = useState(0);
  const [selectedServiceDay, setSelectedServiceDay] = useState('Sunday');
  const [showJoinModal, setShowJoinModal] = useState<ChurchType | null>(null);
  const [isChurchDay, setIsChurchDay] = useState(false);
  const [hasCheckedIn, setHasCheckedIn] = useState(false);
  const [checkingIn, setCheckingIn] = useState(false);

  useEffect(() => {
    fetchMyChurch();
  }, []);

  async function fetchMyChurch() {
    setLoading(true);
    setError(null);
    try {
      const result = await api.church.getMyChurch();
      if (result.data) {
        setMyChurch(result.data);

        // Check if today is the church day
        const today = DAYS_OF_WEEK[new Date().getDay()];
        const churchDay = result.data.serviceDay || 'Sunday';
        setIsChurchDay(today === churchDay);

        // Fetch member and event counts
        const [membersResult, eventsResult] = await Promise.all([
          api.church.getMembers(result.data.id),
          api.church.getEvents(result.data.id),
        ]);
        if (membersResult.data) {
          setMemberCount(membersResult.data.length);
        }
        if (eventsResult.data) {
          setEventCount(eventsResult.data.count || eventsResult.data.events?.length || 0);
        }
      }
    } catch (err) {
      // No church is okay
    }
    setLoading(false);
  }

  async function handleCheckIn() {
    if (!myChurch) return;
    setCheckingIn(true);
    try {
      const result = await api.church.checkIn(myChurch.id);
      if (!result.error) {
        setHasCheckedIn(true);
      }
    } catch (err) {
      setError('Check-in failed');
    }
    setCheckingIn(false);
  }

  async function handleSearch() {
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      const result = await api.church.search(searchQuery);
      if (result.data) {
        setSearchResults(result.data);
      }
    } catch (err) {
      setError('Search failed');
    }
    setSearching(false);
  }

  function openJoinModal(church: ChurchType) {
    setShowJoinModal(church);
    setSelectedServiceDay('Sunday');
  }

  async function handleJoinChurch() {
    if (!showJoinModal) return;
    const result = await api.church.join(showJoinModal.id, selectedServiceDay);
    if (!result.error) {
      setMyChurch({ ...showJoinModal, serviceDay: selectedServiceDay });
      setSearchResults([]);
      setSearchQuery('');
      setShowJoinModal(null);
    }
  }

  async function handleLeaveChurch() {
    if (!myChurch) return;
    const result = await api.church.leave(myChurch.id);
    if (!result.error) {
      setMyChurch(null);
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Church className="w-8 h-8 text-brand-500" />
              Church Community
            </h1>
            <p className="text-gray-600 mt-1">Connect with your local church</p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
          </div>
        ) : myChurch ? (
          /* My Church View */
          <div className="space-y-6">
            {/* Church Card */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-brand-600 to-brand-500 p-6 text-white">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                    <Church className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{myChurch.name}</h2>
                    <div className="flex items-center gap-2 mt-1 opacity-90">
                      <MapPin className="w-4 h-4" />
                      <span>{myChurch.address || 'Location not set'}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-6">
                  {myChurch.description || 'Welcome to our church community!'}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <Users className="w-6 h-6 text-brand-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-900">{memberCount}</p>
                    <p className="text-sm text-gray-500">Members</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <Calendar className="w-6 h-6 text-brand-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-900">{eventCount}</p>
                    <p className="text-sm text-gray-500">Events</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <Calendar className="w-6 h-6 text-indigo-500 mx-auto mb-2" />
                    <p className="text-sm font-medium text-indigo-600">{myChurch?.serviceDay || 'Sunday'}</p>
                    <p className="text-sm text-gray-500">Service Day</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <CheckCircle className="w-6 h-6 text-green-500 mx-auto mb-2" />
                    <p className="text-sm font-medium text-green-600">Active</p>
                    <p className="text-sm text-gray-500">Status</p>
                  </div>
                </div>

                {/* Check-in Card - Only show on church day */}
                {isChurchDay && (
                  <div className={`mb-6 p-4 rounded-xl ${hasCheckedIn ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${hasCheckedIn ? 'bg-green-100' : 'bg-amber-100'}`}>
                          {hasCheckedIn ? (
                            <CheckCircle2 className="w-6 h-6 text-green-600" />
                          ) : (
                            <Church className="w-6 h-6 text-amber-600" />
                          )}
                        </div>
                        <div>
                          <p className={`font-semibold ${hasCheckedIn ? 'text-green-800' : 'text-amber-800'}`}>
                            {hasCheckedIn ? 'Checked In!' : "It's Church Day!"}
                          </p>
                          <p className={`text-sm ${hasCheckedIn ? 'text-green-600' : 'text-amber-600'}`}>
                            {hasCheckedIn ? 'See you next week!' : 'Welcome! Check in to mark your attendance.'}
                          </p>
                        </div>
                      </div>
                      {!hasCheckedIn && (
                        <button
                          onClick={handleCheckIn}
                          disabled={checkingIn}
                          className="px-4 py-2 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 disabled:opacity-70 transition-colors flex items-center gap-2"
                        >
                          {checkingIn ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <CheckCircle2 className="w-4 h-4" />
                          )}
                          Check In
                        </button>
                      )}
                    </div>
                  </div>
                )}
                <button
                  onClick={handleLeaveChurch}
                  className="w-full flex items-center justify-center gap-2 py-3 border border-red-200 text-red-600 font-medium rounded-xl hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  Leave Church
                </button>
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-brand-500" />
                Upcoming Events
              </h3>
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-500">No upcoming events</p>
              </div>
            </div>
          </div>
        ) : (
          /* Find Church View */
          <div className="space-y-6">
            {/* Search */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Find Your Church
              </h2>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by church name or location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none"
                  />
                </div>
                <button
                  onClick={handleSearch}
                  disabled={searching}
                  className="px-6 py-3 bg-brand-500 text-white font-semibold rounded-xl hover:bg-brand-600 disabled:opacity-70 transition-colors"
                >
                  {searching ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    'Search'
                  )}
                </button>
              </div>
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-gray-900">
                  Search Results ({searchResults.length})
                </h3>
                {searchResults.map((church) => (
                  <div
                    key={church.id}
                    className="bg-white rounded-xl border border-gray-200 p-4 hover:border-brand-300 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center">
                          <Church className="w-6 h-6 text-brand-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {church.name}
                          </h4>
                          <p className="text-sm text-gray-500 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {church.address || 'Location not available'}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => openJoinModal(church)}
                        className="flex items-center gap-2 px-4 py-2 bg-brand-500 text-white font-medium rounded-lg hover:bg-brand-600 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        Join
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!searching && searchResults.length === 0 && searchQuery && (
              <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                <Church className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No churches found
                </h3>
                <p className="text-gray-500">
                  Try a different search term or location
                </p>
              </div>
            )}

            {/* Info */}
            {!searchQuery && (
              <div className="bg-brand-50 rounded-2xl border border-brand-100 p-6">
                <h3 className="font-semibold text-brand-900 mb-2">
                  Why join a church?
                </h3>
                <ul className="space-y-2 text-brand-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-brand-500" />
                    Connect with other believers in your area
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-brand-500" />
                    Access church events and activities
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-brand-500" />
                    Share prayer requests with your community
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-brand-500" />
                    Find a disciple partner from your church
                  </li>
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Join Church Modal */}
        {showJoinModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Join {showJoinModal.name}</h2>
              <p className="text-gray-600 mb-6">Select the day you typically attend church services.</p>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Church Day
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {DAYS_OF_WEEK.map((day) => (
                    <button
                      key={day}
                      onClick={() => setSelectedServiceDay(day)}
                      className={`py-2 px-3 text-sm rounded-lg border transition-colors ${
                        selectedServiceDay === day
                          ? 'border-brand-500 bg-brand-50 text-brand-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {day.slice(0, 3)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowJoinModal(null)}
                  className="flex-1 py-3 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleJoinChurch}
                  className="flex-1 py-3 bg-brand-500 text-white font-medium rounded-xl hover:bg-brand-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Join Church
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
