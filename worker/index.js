const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS });
    }

    // 방문자 카운터 API
    if (url.pathname === '/api/visitors') {
      const headers = { ...CORS, 'Content-Type': 'application/json' };

      // 한국 시간(UTC+9) 기준 오늘 날짜 키
      const kstDate = new Date(Date.now() + 9 * 60 * 60 * 1000)
        .toISOString().slice(0, 10);
      const key = `visits:${kstDate}`;

      if (request.method === 'POST') {
        const current = parseInt(await env.VISITORS.get(key) || '0');
        const next = current + 1;
        await env.VISITORS.put(key, String(next), { expirationTtl: 60 * 60 * 24 * 90 });
        return Response.json({ count: next }, { headers });
      }

      const count = parseInt(await env.VISITORS.get(key) || '0');
      return Response.json({ count }, { headers });
    }

    // 부동산 실거래가 API 프록시 (기존 로직)
    const lawdCd    = url.searchParams.get('LAWD_CD')   || '11500';
    const dealYmd   = url.searchParams.get('DEAL_YMD')  || '';
    const numOfRows = url.searchParams.get('numOfRows') || '100';
    const pageNo    = url.searchParams.get('pageNo')    || '1';

    if (!dealYmd) {
      return Response.json({ error: 'DEAL_YMD is required' }, {
        status: 400,
        headers: { 'Access-Control-Allow-Origin': '*' },
      });
    }

    const params = new URLSearchParams({
      serviceKey: env.SERVICE_KEY,
      LAWD_CD:    lawdCd,
      DEAL_YMD:   dealYmd,
      numOfRows,
      pageNo,
    });

    const apiUrl = `https://apis.data.go.kr/1613000/RTMSDataSvcAptTradeDev/getRTMSDataSvcAptTradeDev?${params}`;

    try {
      const res = await fetch(apiUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        },
      });
      const xml = await res.text();
      return new Response(xml, {
        headers: {
          'Content-Type': 'application/xml; charset=utf-8',
          'Access-Control-Allow-Origin': '*',
        },
      });
    } catch (e) {
      return Response.json({ error: e.message }, {
        status: 500,
        headers: { 'Access-Control-Allow-Origin': '*' },
      });
    }
  },
};
