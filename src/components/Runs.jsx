// Word থেকে আসা রান (বোল্ড/ইটালিক/আরবি/পাদটীকা) রেন্ডার
export default function Runs({ runs }) {
  return runs.map((r, i) => {
    if (r.fn) {
      return (
        <sup key={i} className="mx-0.5">
          <a href={`#fn-${r.fn}`} id={`fnref-${r.fn}`} onClick={(e) => { e.preventDefault(); document.getElementById(`fn-${r.fn}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }); }} className="text-brand-600 dark:text-brand-400 font-semibold no-underline">
            [{r.fn}]
          </a>
        </sup>
      );
    }
    let node = r.t;
    if (r.ar) node = <span className="ar-inline">{node}</span>;
    if (r.b) node = <strong>{node}</strong>;
    if (r.i) node = <em>{node}</em>;
    return <span key={i}>{node}</span>;
  });
}
