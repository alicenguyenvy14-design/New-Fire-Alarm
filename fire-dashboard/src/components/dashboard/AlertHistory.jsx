import { Badge } from "./Ui";

export function AlertHistory({ styles, history }) {
  return <div className={`${styles.panel} ${styles.section}`}><h3 className="text-base font-semibold">Lịch sử cảnh báo gần nhất</h3><div className="mt-4 overflow-hidden rounded-2xl border border-slate-200"><div className="grid grid-cols-[120px_120px_minmax(0,1fr)] bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700"><div>Thời gian</div><div>Loại</div><div>Chi tiết</div></div>{history.map((item, index) => <div key={`${item.time}-${index}`} className="grid grid-cols-[120px_120px_minmax(0,1fr)] border-t border-slate-200 bg-white px-4 py-3 text-sm"><div className="text-slate-600">{item.time}</div><div><Badge>{item.type}</Badge></div><div className="text-slate-800">{item.detail}</div></div>)}</div></div>;
}
