export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
        },
      });
    }

    const url = new URL(request.url);
    const lawdCd  = url.searchParams.get('LAWD_CD')  || '11500';
    const dealYmd = url.searchParams.get('DEAL_YMD') || '';
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
      const res  = await fetch(apiUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        },
      });
      const xml  = await res.text();
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
