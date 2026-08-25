import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, Send, Plus, Inbox as InboxIcon, ChevronRight, ArrowLeft, Users, Check, CheckCheck } from 'lucide-react';
import moment from 'moment';
import 'moment/locale/id';
moment.locale('id');

function toTitleCase(str) {
  if (!str) return str;
  return str.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
}

function getThreadId(idA, idB) {
  return [idA, idB].sort().join('_');
}

export default function Inbox() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [selectedThread, setSelectedThread] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [showCompose, setShowCompose] = useState(false);
  const [searchQ, setSearchQ] = useState('');
  const bottomRef = useRef(null);

  // Fetch all messages for current user
  const { data: allMessages = [], isLoading } = useQuery({
    queryKey: ['inbox-messages', user?.id],
    queryFn: () => base44.entities.Message.filter({
      $or: [{ sender_id: user.id }, { recipient_id: user.id }]
    }, '-created_date', 200),
    enabled: !!user?.id,
    refetchInterval: 15000,
  });

  // Mark messages as read when opening a thread
  useEffect(() => {
    if (!selectedThread || !user) return;
    const unread = allMessages.filter(m =>
      m.thread_id === selectedThread &&
      m.recipient_id === user.id &&
      !m.is_read
    );
    unread.forEach(m => base44.entities.Message.update(m.id, { is_read: true }));
    if (unread.length > 0) qc.invalidateQueries(['inbox-messages', user?.id]);
  }, [selectedThread, allMessages]);

  // Scroll to bottom when thread opens or new message arrives
  useEffect(() => {
    if (selectedThread) {
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  }, [selectedThread, allMessages.length]);

  // Group messages into threads
  const threads = useMemo(() => {
    const map = {};
    allMessages.forEach(m => {
      if (!map[m.thread_id]) {
        map[m.thread_id] = { thread_id: m.thread_id, messages: [], unread: 0, last_msg: null };
      }
      map[m.thread_id].messages.push(m);
      if (!m.is_read && m.recipient_id === user?.id) map[m.thread_id].unread++;
    });
    return Object.values(map)
      .map(t => {
        t.messages.sort((a, b) => new Date(a.created_date) - new Date(b.created_date));
        t.last_msg = t.messages[t.messages.length - 1];
        // Determine the other person
        const other = t.last_msg.sender_id === user?.id
          ? { id: t.last_msg.recipient_id, name: t.last_msg.recipient_name }
          : { id: t.last_msg.sender_id, name: t.last_msg.sender_name };
        t.other = other;
        return t;
      })
      .sort((a, b) => new Date(b.last_msg.created_date) - new Date(a.last_msg.created_date));
  }, [allMessages, user?.id]);

  const filteredThreads = useMemo(() => {
    if (!searchQ) return threads;
    return threads.filter(t =>
      (t.other?.name || '').toLowerCase().includes(searchQ.toLowerCase())
    );
  }, [threads, searchQ]);

  const totalUnread = useMemo(() => allMessages.filter(m => !m.is_read && m.recipient_id === user?.id).length, [allMessages, user?.id]);

  const activeThread = useMemo(() => threads.find(t => t.thread_id === selectedThread), [threads, selectedThread]);

  const sendMutation = useMutation({
    mutationFn: async ({ recipientId, recipientName, body }) => {
      const threadId = getThreadId(user.id, recipientId);
      await base44.entities.Message.create({
        sender_id: user.id,
        sender_name: user.full_name,
        recipient_id: recipientId,
        recipient_name: recipientName,
        body: body.trim(),
        thread_id: threadId,
        is_read: false,
      });
      return threadId;
    },
    onSuccess: (threadId) => {
      qc.invalidateQueries(['inbox-messages', user?.id]);
      if (threadId) setSelectedThread(threadId);
      setReplyText('');
      setShowCompose(false);
    },
  });

  const handleComposeRefresh = () => {
    qc.invalidateQueries(['inbox-messages', user?.id]);
    setShowCompose(false);
  };

  const handleReply = () => {
    if (!replyText.trim() || !activeThread) return;
    sendMutation.mutate({
      recipientId: activeThread.other.id,
      recipientName: activeThread.other.name,
      body: replyText,
    });
  };

  if (!user) return (
    <div className="flex items-center justify-center py-32 text-muted-foreground">
      <p>Silakan login untuk mengakses Inbox.</p>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <InboxIcon className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="font-heading font-bold text-2xl text-foreground">Inbox</h1>
            <p className="text-xs text-muted-foreground">Pesan antar alumni ALSITS</p>
          </div>
          {totalUnread > 0 && <Badge className="bg-red-500 text-white border-0">{totalUnread}</Badge>}
        </div>
        <Button onClick={() => setShowCompose(true)} className="gap-2">
          <Plus className="h-4 w-4" /> Pesan Baru
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[600px]">
        {/* Thread List */}
        <div className={`md:col-span-1 bg-card border border-border rounded-2xl overflow-hidden flex flex-col ${selectedThread ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-3 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Cari percakapan..." className="pl-9 h-9 text-sm" value={searchQ} onChange={e => setSearchQ(e.target.value)} />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-12 text-muted-foreground text-sm">Memuat...</div>
            ) : filteredThreads.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground px-4 text-center">
                <InboxIcon className="w-10 h-10 mb-3 text-muted-foreground/30" />
                <p className="text-sm">Belum ada pesan</p>
                <p className="text-xs mt-1">Mulai percakapan dengan alumni lain</p>
              </div>
            ) : filteredThreads.map(t => (
              <button key={t.thread_id}
                onClick={() => setSelectedThread(t.thread_id)}
                className={`w-full px-4 py-3.5 flex items-start gap-3 text-left border-b border-border/50 hover:bg-secondary/50 transition-colors ${selectedThread === t.thread_id ? 'bg-secondary' : ''}`}>
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="font-heading font-bold text-primary text-sm">
                    {(toTitleCase(t.other?.name) || '?').charAt(0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-sm font-semibold truncate ${t.unread > 0 ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {toTitleCase(t.other?.name) || 'Alumni'}
                    </span>
                    <span className="text-[10px] text-muted-foreground shrink-0">
                      {moment(t.last_msg.created_date).fromNow()}
                    </span>
                  </div>
                  <p className={`text-xs truncate mt-0.5 ${t.unread > 0 ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                    {t.last_msg.sender_id === user.id ? '↳ ' : ''}{t.last_msg.body}
                  </p>
                </div>
                {t.unread > 0 && (
                  <span className="shrink-0 w-5 h-5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">
                    {t.unread}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Panel */}
        <div className={`md:col-span-2 bg-card border border-border rounded-2xl overflow-hidden flex flex-col ${selectedThread ? 'flex' : 'hidden md:flex'}`}>
          {!activeThread ? (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground gap-3">
              <Users className="w-12 h-12 text-muted-foreground/20" />
              <p className="text-sm">Pilih percakapan untuk mulai</p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="px-4 py-3 border-b border-border flex items-center gap-3">
                <button className="md:hidden text-muted-foreground hover:text-foreground mr-1" onClick={() => setSelectedThread(null)}>
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="font-heading font-bold text-primary text-sm">
                    {(toTitleCase(activeThread.other?.name) || '?').charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground">{toTitleCase(activeThread.other?.name)}</p>
                  <p className="text-xs text-muted-foreground">Alumni ALSITS</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {activeThread.messages.map(m => {
                  const isMine = m.sender_id === user.id;
                  return (
                    <div key={m.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                        isMine
                          ? 'bg-primary text-white rounded-br-sm'
                          : 'bg-secondary text-foreground rounded-bl-sm'
                      }`}>
                        <p className="whitespace-pre-wrap break-words">{m.body}</p>
                        <div className={`flex items-center gap-1 mt-1 text-[10px] ${isMine ? 'text-white/60 justify-end' : 'text-muted-foreground'}`}>
                          <span>{moment(m.created_date).format('HH:mm')}</span>
                          {isMine && (m.is_read ? <CheckCheck className="h-3 w-3" /> : <Check className="h-3 w-3" />)}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>

              {/* Reply box */}
              <div className="px-4 py-3 border-t border-border">
                <div className="flex gap-2 items-end">
                  <Textarea
                    placeholder="Tulis pesan..."
                    className="resize-none min-h-[60px] max-h-[120px] text-sm flex-1"
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleReply(); }
                    }}
                  />
                  <Button size="icon" onClick={handleReply} disabled={!replyText.trim() || sendMutation.isPending} className="shrink-0 h-10 w-10">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">Enter untuk kirim · Shift+Enter untuk baris baru</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Compose Modal */}
      <ComposeModal
        open={showCompose}
        onClose={() => setShowCompose(false)}
        currentUser={user}
        onSend={handleComposeRefresh}
        isSending={false}
      />
    </div>
  );
}

function ComposeModal({ open, onClose, currentUser, onSend, isSending }) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState([]); // array of user objects
  const [body, setBody] = useState('');
  const [sendToAll, setSendToAll] = useState(false);
  const [sending, setSending] = useState(false);

  const { data: users = [] } = useQuery({
    queryKey: ['all-users-inbox'],
    queryFn: () => base44.entities.User.list(),
    enabled: open,
  });

  const otherUsers = useMemo(() => users.filter(u => u.id !== currentUser?.id), [users, currentUser?.id]);

  const filtered = useMemo(() => {
    const selectedIds = new Set(selected.map(s => s.id));
    return otherUsers.filter(u =>
      !selectedIds.has(u.id) &&
      (u.full_name || '').toLowerCase().includes(search.toLowerCase())
    );
  }, [otherUsers, search, selected]);

  const handleClose = () => {
    setSearch(''); setSelected([]); setBody(''); setSendToAll(false); setSending(false);
    onClose();
  };

  const addRecipient = (u) => {
    setSelected(prev => [...prev, u]);
    setSearch('');
  };

  const removeRecipient = (id) => setSelected(prev => prev.filter(u => u.id !== id));

  const toggleSendToAll = () => {
    setSendToAll(prev => !prev);
    setSelected([]);
    setSearch('');
  };

  const handleSend = async () => {
    if (!body.trim()) return;
    const targets = sendToAll ? otherUsers : selected;
    if (targets.length === 0) return;
    setSending(true);
    // Send to each recipient individually
    for (const recipient of targets) {
      const threadId = getThreadId(currentUser.id, recipient.id);
      await base44.entities.Message.create({
        sender_id: currentUser.id,
        sender_name: currentUser.full_name,
        recipient_id: recipient.id,
        recipient_name: recipient.full_name,
        body: body.trim(),
        thread_id: threadId,
        is_read: false,
      });
    }
    setSending(false);
    handleClose();
    onSend(null, null, null); // trigger refresh
  };

  const recipientCount = sendToAll ? otherUsers.length : selected.length;
  const canSend = body.trim() && recipientCount > 0 && !sending;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading text-lg flex items-center gap-2">
            <Send className="h-5 w-5 text-primary" /> Pesan Baru
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-1">
          {/* Send to all toggle */}
          <button
            onClick={toggleSendToAll}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-all text-sm font-medium ${
              sendToAll
                ? 'bg-primary/15 border-primary/40 text-primary'
                : 'bg-secondary/40 border-border text-muted-foreground hover:text-foreground hover:border-primary/30'
            }`}
          >
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${sendToAll ? 'border-primary bg-primary' : 'border-muted-foreground'}`}>
              {sendToAll && <span className="text-white text-[10px] font-bold">✓</span>}
            </div>
            <div className="text-left">
              <span className="block">📢 Kirim ke Semua Member</span>
              {sendToAll && <span className="text-xs font-normal opacity-70">{otherUsers.length} member akan menerima pesan ini</span>}
            </div>
          </button>

          {/* Recipient selector */}
          {!sendToAll && (
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground block mb-1.5">
                Kirim ke {selected.length > 0 && <span className="text-primary normal-case font-normal">({selected.length} dipilih)</span>}
              </label>
              {/* Selected chips */}
              {selected.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {selected.map(u => (
                    <span key={u.id} className="flex items-center gap-1 px-2.5 py-1 bg-primary/15 border border-primary/30 rounded-full text-xs text-primary font-medium">
                      {toTitleCase(u.full_name)}
                      <button onClick={() => removeRecipient(u.id)} className="ml-0.5 hover:text-red-400 transition-colors">✕</button>
                    </span>
                  ))}
                </div>
              )}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input className="pl-9" placeholder="Cari nama alumni/member..." value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              {search && (
                <div className="mt-1 max-h-40 overflow-y-auto bg-card border border-border rounded-xl shadow-lg">
                  {filtered.length === 0 ? (
                    <p className="px-4 py-3 text-sm text-muted-foreground">Tidak ditemukan</p>
                  ) : filtered.slice(0, 10).map(u => (
                    <button key={u.id} onClick={() => addRecipient(u)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-secondary/50 transition-colors text-left">
                      <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-primary">{(u.full_name || '?').charAt(0)}</span>
                      </div>
                      <span className="text-sm text-foreground">{toTitleCase(u.full_name)}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground block mb-1.5">Pesan</label>
            <Textarea
              placeholder="Tulis pesan Anda di sini..."
              className="resize-none min-h-[120px]"
              value={body}
              onChange={e => setBody(e.target.value)}
            />
          </div>

          <div className="flex gap-3 pt-1">
            <Button variant="outline" onClick={handleClose} className="flex-1" disabled={sending}>Batal</Button>
            <Button onClick={handleSend} disabled={!canSend} className="flex-1 gap-2">
              <Send className="h-4 w-4" />
              {sending ? `Mengirim ke ${recipientCount}...` : `Kirim${recipientCount > 1 ? ` (${recipientCount})` : ''}`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}