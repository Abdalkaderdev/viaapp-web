'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect, useRef } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { api } from '@/lib/api';
import type { DisciplePartnership, PartnershipRecommendation, PartnershipStats, PartnershipMessage } from '@shared/types';
import {
  Users,
  Search,
  UserPlus,
  MessageSquare,
  Flame,
  BookOpen,
  Heart,
  CheckCircle,
  Clock,
  Send,
  X,
  Loader2,
  AlertCircle,
} from 'lucide-react';

export default function PartnerPage() {
  const [activePartnership, setActivePartnership] = useState<DisciplePartnership | null>(null);
  const [pendingRequests, setPendingRequests] = useState<DisciplePartnership[]>([]);
  const [recommendations, setRecommendations] = useState<PartnershipRecommendation[]>([]);
  const [stats, setStats] = useState<PartnershipStats | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Message modal state
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messages, setMessages] = useState<PartnershipMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchPartnershipData();
  }, []);

  async function fetchPartnershipData() {
    setLoading(true);
    setError(null);

    try {
      const [activeResult, pendingResult, recommendationsResult, statsResult] = await Promise.all([
        api.partnerships.getActive(),
        api.partnerships.getPending(),
        api.partnerships.getRecommendations(),
        api.partnerships.getStats(),
      ]);

      if (activeResult.data && activeResult.data.length > 0) {
        setActivePartnership(activeResult.data[0]);
      }
      if (pendingResult.data) {
        setPendingRequests(pendingResult.data);
      }
      if (recommendationsResult.data) {
        setRecommendations(recommendationsResult.data);
      }
      if (statsResult.data) {
        setStats(statsResult.data);
      }
    } catch {
      setError('Failed to load partnership data');
    } finally {
      setLoading(false);
    }
  }

  async function handleAcceptRequest(partnershipId: string) {
    setActionLoading(partnershipId);
    const result = await api.partnerships.acceptRequest(partnershipId);
    if (result.data) {
      setActivePartnership(result.data);
      setPendingRequests((prev) => prev.filter((r) => r.id !== partnershipId));
    }
    setActionLoading(null);
  }

  async function handleRejectRequest(partnershipId: string) {
    setActionLoading(partnershipId);
    await api.partnerships.rejectRequest(partnershipId);
    setPendingRequests((prev) => prev.filter((r) => r.id !== partnershipId));
    setActionLoading(null);
  }

  async function handleConnect(partnerId: string) {
    setActionLoading(partnerId);
    const result = await api.partnerships.sendRequest(partnerId);
    if (result.data) {
      setRecommendations((prev) => prev.filter((r) => r.id !== partnerId));
    }
    setActionLoading(null);
  }

  async function handleSendInvite() {
    if (!inviteEmail) return;
    setActionLoading('invite');
    // For now, we'll just close the modal as email invites would need backend support
    // This would typically send an email invitation
    setShowInviteModal(false);
    setInviteEmail('');
    setActionLoading(null);
  }

  async function handleOpenMessages() {
    if (!activePartnership) return;
    setShowMessageModal(true);
    setMessagesLoading(true);

    const result = await api.partnerships.getMessages(activePartnership.id);
    if (result.data) {
      setMessages(result.data);
    }
    setMessagesLoading(false);
  }

  async function handleSendMessage() {
    if (!activePartnership || !newMessage.trim()) return;
    setSendingMessage(true);

    const result = await api.partnerships.sendMessage(activePartnership.id, newMessage.trim());
    if (result.data) {
      setMessages(prev => [...prev, result.data!]);
      setNewMessage('');
      // Scroll to bottom
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
    setSendingMessage(false);
  }

  function formatMessageTime(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return date.toLocaleDateString();
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 rounded-2xl border border-red-100 p-6 flex items-center gap-4">
            <AlertCircle className="w-6 h-6 text-red-500" />
            <div>
              <p className="font-medium text-red-900">{error}</p>
              <button
                onClick={fetchPartnershipData}
                className="text-sm text-red-600 hover:underline mt-1"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const partner = activePartnership?.partner;

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Users className="w-8 h-8 text-brand-500" />
              Disciple Partner
            </h1>
            <p className="text-gray-600 mt-1">
              Grow together with an accountability partner
            </p>
          </div>
          {!activePartnership && (
            <button
              onClick={() => setShowInviteModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-brand-500 text-white font-semibold rounded-xl hover:bg-brand-600 transition-colors"
            >
              <UserPlus className="w-5 h-5" />
              Invite Partner
            </button>
          )}
        </div>

        {activePartnership && partner ? (
          /* Partner Connected View */
          <div className="space-y-6">
            {/* Partner Card */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-green-600 to-emerald-500 p-6 text-white">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold">
                    {partner.fullName?.charAt(0) || 'P'}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{partner.fullName}</h2>
                    <p className="opacity-90">Your Disciple Partner</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <Flame className="w-6 h-6 text-amber-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-900">{stats?.streak || 0}</p>
                    <p className="text-sm text-gray-500">Day Streak</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <BookOpen className="w-6 h-6 text-brand-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-900">{stats?.qtSessions || 0}</p>
                    <p className="text-sm text-gray-500">QT Sessions</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <Heart className="w-6 h-6 text-rose-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-900">{stats?.prayersShared || 0}</p>
                    <p className="text-sm text-gray-500">Prayers Shared</p>
                  </div>
                </div>
                <button
                  onClick={handleOpenMessages}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-brand-500 text-white font-semibold rounded-xl hover:bg-brand-600 transition-colors"
                >
                  <MessageSquare className="w-5 h-5" />
                  Send Message
                </button>
              </div>
            </div>

            {/* Accountability Questions */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Weekly Check-in Questions
              </h3>
              <div className="space-y-3">
                {[
                  'How consistent has your quiet time been this week?',
                  'What Scripture has God been speaking to you through?',
                  'How can I pray for you this week?',
                ].map((question, i) => (
                  <div key={i} className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-gray-700">{question}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Find Partner View */
          <div className="space-y-6">
            {/* Pending Requests */}
            {pendingRequests.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-500" />
                  Pending Requests
                </h2>
                <div className="space-y-3">
                  {pendingRequests.map((request) => (
                    <div
                      key={request.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center text-brand-600 font-semibold">
                          {request.requester?.fullName?.charAt(0) || '?'}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {request.requester?.fullName || 'Unknown'}
                          </p>
                          <p className="text-sm text-gray-500">{request.requester?.email}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAcceptRequest(request.id)}
                          disabled={actionLoading === request.id}
                          className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors disabled:opacity-50"
                        >
                          {actionLoading === request.id ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <CheckCircle className="w-5 h-5" />
                          )}
                        </button>
                        <button
                          onClick={() => handleRejectRequest(request.id)}
                          disabled={actionLoading === request.id}
                          className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Search */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Find a Partner
              </h2>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none"
                />
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-brand-500" />
                Recommended Partners
              </h2>
              {recommendations.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No recommendations available yet. Try inviting a friend!
                </p>
              ) : (
                <div className="space-y-3">
                  {recommendations.map((person) => (
                    <div
                      key={person.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center text-brand-600 font-bold">
                          {person.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{person.name}</p>
                          <p className="text-sm text-gray-500">{person.church || 'No church'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-amber-500">
                          <Flame className="w-4 h-4" />
                          <span className="text-sm font-medium">{person.streak}</span>
                        </div>
                        <button
                          onClick={() => handleConnect(person.id)}
                          disabled={actionLoading === person.id}
                          className="flex items-center gap-2 px-3 py-1.5 bg-brand-500 text-white text-sm font-medium rounded-lg hover:bg-brand-600 transition-colors disabled:opacity-50"
                        >
                          {actionLoading === person.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              <UserPlus className="w-4 h-4" />
                              Connect
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Benefits */}
            <div className="bg-green-50 rounded-2xl border border-green-100 p-6">
              <h3 className="font-semibold text-green-900 mb-3">
                Benefits of a Disciple Partner
              </h3>
              <ul className="space-y-2 text-green-700">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Weekly accountability check-ins
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Share prayer requests privately
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Track each other&apos;s spiritual growth
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Encourage one another in the faith
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Invite Modal */}
        {showInviteModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Invite a Partner
                </h2>
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <p className="text-gray-600 mb-4">
                Enter your friend&apos;s email to send them an invitation to become
                your disciple partner.
              </p>
              <input
                type="email"
                placeholder="friend@example.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none mb-4"
              />
              <button
                onClick={handleSendInvite}
                disabled={!inviteEmail || actionLoading === 'invite'}
                className="w-full flex items-center justify-center gap-2 py-3 bg-brand-500 text-white font-semibold rounded-xl hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {actionLoading === 'invite' ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Invitation
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Message Modal */}
        {showMessageModal && activePartnership && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg h-[600px] flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center text-brand-600 font-bold">
                    {partner?.fullName?.charAt(0) || 'P'}
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-900">{partner?.fullName}</h2>
                    <p className="text-sm text-gray-500">Your Disciple Partner</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowMessageModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messagesLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <MessageSquare className="w-12 h-12 mb-2 opacity-50" />
                    <p>No messages yet</p>
                    <p className="text-sm">Send a message to your partner!</p>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isMe = msg.senderId !== partner?.id;
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                            isMe
                              ? 'bg-brand-500 text-white rounded-br-md'
                              : 'bg-gray-100 text-gray-900 rounded-bl-md'
                          }`}
                        >
                          <p className="break-words">{msg.content}</p>
                          <p
                            className={`text-xs mt-1 ${
                              isMe ? 'text-white/70' : 'text-gray-500'
                            }`}
                          >
                            {formatMessageTime(msg.createdAt)}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || sendingMessage}
                    className="px-4 py-3 bg-brand-500 text-white rounded-xl hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {sendingMessage ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
