import { createClientFromRequest, createClient } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.clone().json().catch(() => ({}));
    const isScheduled = body.scheduled === true;

    if (!isScheduled) {
      const user = await base44.auth.me();
      if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
      if (user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });
      console.log('Manual event sync by:', user.email);
    } else {
      console.log('Scheduled event sync started');
    }

    const s32Client = createClient({
      appId: Deno.env.get('S32_APP_ID'),
      headers: { 'api_key': Deno.env.get('S32_API_KEY') }
    });

    // Fetch events dari s32its.id
    let s32Events = [];
    try {
      s32Events = await s32Client.entities.Event.list('-updated_date', 200);
      console.log(`Fetched ${s32Events.length} events from s32its.id`);
    } catch (e) {
      console.log('Event fetch error:', e.message);
      return Response.json({ error: 'Gagal fetch dari s32its.id: ' + e.message }, { status: 500 });
    }

    // Ambil semua event s32 yang sudah ada di ALSITS
    const existing = await base44.asServiceRole.entities.AlsitsEvent.filter({ angkatan: 'S32' }, '-created_date', 500);
    const existingBySourceUrl = {};
    existing.forEach(e => {
      if (e.source_url) existingBySourceUrl[e.source_url] = e;
    });

    let created = 0;
    let updated = 0;

    for (const ev of s32Events) {
      // ID unik untuk dedup, tapi simpan juga URL publik s32its.id
      const sourceUrl = `s32its.id/event/${ev.id}`;

      // Gabungkan cover image + promo images sebagai galeri
      const galleryImages = [];
      if (ev.promo_images && Array.isArray(ev.promo_images)) galleryImages.push(...ev.promo_images);
      if (ev.gallery_images && Array.isArray(ev.gallery_images)) galleryImages.push(...ev.gallery_images);

      const eventData = {
        title: ev.title || 'Kegiatan S32',
        category: 'Angkatan',
        angkatan: 'S32',
        description: ev.description || '',
        cover_image: ev.image_url || (ev.promo_images?.[0] || ''),
        gallery: galleryImages.length > 0 ? JSON.stringify(galleryImages) : '[]',
        event_date: ev.event_date || null,
        location: ev.location || '',
        is_published: true,
        source_url: sourceUrl,
        video_url: ev.video_url || '',
      };

      const existingRecord = existingBySourceUrl[sourceUrl];
      if (existingRecord) {
        await base44.asServiceRole.entities.AlsitsEvent.update(existingRecord.id, eventData);
        updated++;
        console.log(`Updated event: ${ev.title}`);
      } else {
        const newRec = await base44.asServiceRole.entities.AlsitsEvent.create(eventData);
        existingBySourceUrl[sourceUrl] = newRec;
        created++;
        console.log(`Created event: ${ev.title}`);
      }

      await new Promise(r => setTimeout(r, 150));
    }

    return Response.json({
      success: true,
      message: `Sync event s32its.id selesai`,
      stats: { fetched: s32Events.length, created, updated }
    });

  } catch (error) {
    console.error('Event sync error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});