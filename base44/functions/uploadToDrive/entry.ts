import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { fileName, fileContentBase64, mimeType = 'application/pdf', folderName = 'ALSITS - Dokumen Proyek 2026' } = await req.json();

    if (!fileName || !fileContentBase64) {
      return Response.json({ error: 'fileName dan fileContentBase64 diperlukan' }, { status: 400 });
    }

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googledrive');
    const authHeader = { Authorization: `Bearer ${accessToken}` };

    // Cari atau buat folder proyek
    let folderId = null;
    const searchRes = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=name='${encodeURIComponent(folderName)}' and mimeType='application/vnd.google-apps.folder' and trashed=false&fields=files(id,name)`,
      { headers: authHeader }
    );
    const searchData = await searchRes.json();

    if (searchData.files && searchData.files.length > 0) {
      folderId = searchData.files[0].id;
    } else {
      // Buat folder baru
      const createFolderRes = await fetch('https://www.googleapis.com/drive/v3/files', {
        method: 'POST',
        headers: { ...authHeader, 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: folderName, mimeType: 'application/vnd.google-apps.folder' }),
      });
      const folder = await createFolderRes.json();
      folderId = folder.id;
    }

    // Upload file ke folder
    const fileBytes = Uint8Array.from(atob(fileContentBase64), c => c.charCodeAt(0));

    const metadata = JSON.stringify({ name: fileName, parents: [folderId] });
    const boundary = '-------314159265358979323846';
    const delimiter = `\r\n--${boundary}\r\n`;
    const closeDelimiter = `\r\n--${boundary}--`;

    const metaPart = `Content-Type: application/json; charset=UTF-8\r\n\r\n${metadata}`;
    const filePart = `Content-Type: ${mimeType}\r\nContent-Transfer-Encoding: base64\r\n\r\n${fileContentBase64}`;
    const body = `${delimiter}${metaPart}${delimiter}${filePart}${closeDelimiter}`;

    const uploadRes = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink', {
      method: 'POST',
      headers: {
        ...authHeader,
        'Content-Type': `multipart/related; boundary="${boundary}"`,
      },
      body,
    });

    if (!uploadRes.ok) {
      const err = await uploadRes.json();
      return Response.json({ error: 'Upload gagal', detail: err }, { status: 500 });
    }

    const uploaded = await uploadRes.json();
    return Response.json({ success: true, fileId: uploaded.id, fileName: uploaded.name, webViewLink: uploaded.webViewLink, folderId });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});