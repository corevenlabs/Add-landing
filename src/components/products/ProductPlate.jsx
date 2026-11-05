export default function ProductPlate({ product }) {
  const { id, name, category, lines } = product;
  let symbol;
  if (id === '02') symbol = <g fill="#262e35"><circle cx="127" cy="80" r="10" /><path d="M115 96h24v42h-8v28h-8v-28h-8z" /><circle cx="172" cy="80" r="10" /><path d="M160 96h24v42h-8v28h-8v-28h-8z" /></g>;
  else if (category === 'seguridad') symbol = <><circle cx="150" cy="111" r="43" fill="none" stroke="#cb2933" strokeWidth="8" /><path d="M120 80l60 62" stroke="#cb2933" strokeWidth="8" /><path d="M140 86h20v50h-20z" fill="#333" /></>;
  else if (id === '05') symbol = <><path d="M95 70h110v108H95z" fill="#fff" stroke="#c8ccce" /><path d="M108 95h84M108 110h84M108 125h70M108 140h78M108 155h65" stroke="#bdc5c9" strokeWidth="2" /></>;
  else symbol = <><circle cx="150" cy="113" r="40" fill="none" stroke="#657a85" strokeWidth="2" /><path d="M130 113l14 14 28-34" fill="none" stroke="#657a85" strokeWidth="6" /></>;
  return <svg viewBox="0 0 300 300" role="img" aria-label={`Visualización referencial: ${name}`}>
    <defs><linearGradient id={`s${id}`} x2="1" y2="1"><stop stopColor="#f9faf9" /><stop offset=".5" stopColor="#c4cccd" /><stop offset=".7" stopColor="#f3f4f2" /><stop offset="1" stopColor="#a8b0b4" /></linearGradient></defs>
    <path d="M55 31L244 42 238 267 50 254Z" fill="#000" opacity=".08" /><rect x="55" y="30" width="190" height="230" rx="3" fill={`url(#s${id})`} stroke="#a0a9ad" />
    {[[65, 40], [235, 40], [65, 250], [235, 250]].map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r="5" fill="#879198" stroke="#e6e8e8" />)}
    {symbol}<text x="150" y="201" textAnchor="middle" fill="#273239" fontFamily="Arial" fontSize="12" fontWeight="bold">{lines[0]}</text><text x="150" y="222" textAnchor="middle" fill="#273239" fontFamily="Arial" fontSize="11">{lines[1]}</text>
  </svg>;
}
