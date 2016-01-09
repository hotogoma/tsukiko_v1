'use strict';

module.exports = function(year, sl) {
  let dt = deltaT(year) / 86400.0;
  let sl0 = 285;
  let n = 0;
  let h = Sunlongdays(year,sl);
  h = h + 9 / 24 - dt;
  let date = new Date(year, 0, 0);
  return new Date(date.getTime() + h * 86400000);
};

function deltaT(year) {
  return (58 + 0.44 * (year - 1990));
};

function Sunlongdays(year, kaku) {
  let t0,t,sl,dsl,bsl,ofs;
  t0 = getJulian(year, 1, 1) - getJulian(2000, 1, 1) - 1.5;
  bsl = SunLong(t0);
  if (kaku < bsl) ofs = -360.0;
  else ofs = 0.0;
  t = kaku - bsl - ofs;
  t = Math.floor(t * 0.9);
  for (;;)
  {
    sl = SunLong(t + t0);
    if (sl < bsl) bsl += ofs;
    if ((sl >= kaku) && (bsl < kaku))
    {
      t += (kaku - sl) / (sl - bsl);
      t += (kaku - SunLong(t + t0)) / (sl - bsl);
      break;
    }
    bsl = sl;
    t++;
  }
  return t;
};

const sla = new Array(36000.7695,280.4659,1.9147,0.0200,-0.0048,0.0020,0.0018,0.0018,0.0015,0.0013,0.0007,0.0007,0.0007,0.0006,0.0005,0.0005,0.0004,0.0004);
const slb = new Array(0,0,35999.05,71998.1,35999,32964,19,445267,45038,22519,65929,3035,9038,33718,155,2281,29930,31557);
const slc = new Array(0,0,267.52,265.1,268,158,159,208,254,352,45,110,64,316,118,221,48,161);
function SunMLong(T) {
  let d2r,kaku,i,ans;
  d2r = Math.PI / 180.0;
  T /= 36525.0;
  ans = 0.0;
  for (i = 17; i >= 0 ; i--)
  {
    kaku = (slb[i] * T + slc[i]) * d2r;
    if ((i == 0) || (i == 4)) ans += sla[i] * T * Math.cos(kaku);
    else ans += sla[i] * Math.cos(kaku);
  }
  ans = ans - Math.floor(ans / 360.0) * 360.0;
  return ans;
};

function SunLong(T) {
  let d2r,ans,dans;
  d2r = Math.PI / 180.0;
  dans = -0.0057 + 0.0048 * Math.cos((1934 * T / 36525.0 + 145) * d2r);
  ans = SunMLong(T);
  ans += dans;
  while(ans < 0.0) ans += 360.0;
  while(ans >= 360.0) ans -= 360.0;
  return ans;
};

function getJulian(y, m, d) {
  let date = new Date(y, m, d);
  return Math.floor((date.getTime() / 86400000) - (date.getTimezoneOffset()/1440) + 2440587.5);
};
