import { useState, useEffect } from 'react'
import confetti from 'canvas-confetti'
import './App.css'

function App() {

  const [notas, setNotas] = useState(() => {
    const guardado = localStorage.getItem('datos-diario-anime')
    return guardado ? JSON.parse(guardado) : []
  })
  
  const [entrada, setEntrada] = useState('')
  const [busqueda, setBusqueda] = useState('') 
  const [idEditando, setIdEditando] = useState(null)
  const [stickerSeleccionado, setStickerSeleccionado] = useState('⭐')
  const [animoSeleccionado, setAnimoSeleccionado] = useState('#a2d2ff')

  const pegatinas = ["🌸", "✨", "🎀", "🌙", "🦄", "🍡", "🧁", "🐾", "🍭"]
  const animos = [
    { emoji: "😊", color: "#ffafcc", nombre: "Feliz" },
    { emoji: "😴", color: "#bde0fe", nombre: "Relax" },
    { emoji: "🔥", color: "#ff8fab", nombre: "Top" },
    { emoji: "☁️", color: "#cdb4db", nombre: "Tranqui" }
  ]

  const frases = [
    "¡Haz de hoy una historia increíble! ✨",
    "Incluso los días grises tienen su brillo... ☁️",
    "Tu esfuerzo de hoy es tu éxito de mañana. 💪",
    "No olvides descansar, te lo mereces. 🍵"
  ]

  const [fraseDelDia] = useState(() => frases[Math.floor(Math.random() * frases.length)])


  const sonar = (tipo) => {
    const pop = new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3');
    const magia = new Audio('https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3');
    if (tipo === 'pop') pop.play();
    if (tipo === 'magia') magia.play();
  }

  useEffect(() => {
    localStorage.setItem('datos-diario-anime', JSON.stringify(notas))
  }, [notas])


  const guardarNota = () => {
    if (!entrada.trim()) return
    sonar('magia');
    
    if (!idEditando) {
      confetti({ 
        particleCount: 100, 
        spread: 70, 
        origin: { y: 0.6 }, 
        colors: ['#ffafcc', '#cdb4db', '#a2d2ff'] 
      });
    }

    if (idEditando) {
      setNotas(notas.map(n => 
        n.id === idEditando ? { ...n, texto: entrada, sticker: stickerSeleccionado, colorAnimo: animoSeleccionado } : n
      ))
      setIdEditando(null)
    } else {
      const nuevaNota = {
        id: Date.now(),
        texto: entrada,
        sticker: stickerSeleccionado,
        colorAnimo: animoSeleccionado,
        fecha: new Date().toLocaleDateString('es-ES', {
          weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit'
        })
      }
      setNotas([nuevaNota, ...notas])
    }
    setEntrada('')
    setIdEditando(null)
  }

  const empezarAEditar = (nota) => {
    sonar('pop');
    setEntrada(nota.texto)
    setIdEditando(nota.id)
    setStickerSeleccionado(nota.sticker)
    setAnimoSeleccionado(nota.colorAnimo)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const borrarNota = (id) => {
    setNotas(notas.filter(n => n.id !== id))
  }


  const notasFiltradas = notas.filter(n => 
    n.texto.toLowerCase().includes(busqueda.toLowerCase())
  )

  return (
    <div className="ContenedorApp">
      <header className="cabecera-diario">
        <h1>Mi Diario</h1>
        <p className="frase-dia">{fraseDelDia}</p>
        <p className="subtitulo">
          {idEditando ? "Editando pesamiento... (✎﹏✎)" : "Escribe tu pensamiento de hoy (´｡• ᵕ •｡`) ♡"}
        </p>
      </header>

      <div className="caja-busqueda">
        <input 
          type="text" 
          placeholder="🔍 Buscar pensamiento..." 
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>
      
      <div className="seccion-editor">
        <div className="etiqueta-selector">¿Cómo te sientes hoy?</div>
        <div className="selector-animo">
          {animos.map(a => (
            <button 
              key={a.nombre} 
              className={`boton-animo ${animoSeleccionado === a.color ? 'activo' : ''}`}
              style={{ '--color-animo': a.color }}
              onClick={() => { setAnimoSeleccionado(a.color); sonar('pop'); }}
            >
              {a.emoji}
            </button>
          ))}
        </div>

        <div className="etiqueta-selector">Elige un sticker</div>
        <div className="selector-sticker">
          {pegatinas.map(p => (
            <button 
              key={p} 
              className={`boton-sticker ${stickerSeleccionado === p ? 'activo' : ''}`}
              onClick={() => { setStickerSeleccionado(p); sonar('pop'); }}
            >
              {p}
            </button>
          ))}
        </div>

        <textarea 
          value={entrada} 
          onChange={(e) => setEntrada(e.target.value)}
          placeholder="Cuéntame qué pasó hoy..."
        />
        <button className="boton-guardar" onClick={guardarNota}>
          {idEditando ? 'Actualizar Recuerdo ✨' : 'Guardar en mi Diario ✨'}
        </button>
      </div>

      <div className="lista-notas">
        {notasFiltradas.map((nota) => (
          <div key={nota.id} className="tarjeta-nota" style={{ borderLeftColor: nota.colorAnimo }}>
            <div className="sticker-nota">{nota.sticker}</div>
            <div className="cabecera-tarjeta">
              <span className="fecha-nota" style={{ background: nota.colorAnimo }}>{nota.fecha}</span>
            </div>
            <p className="texto-nota">{nota.texto}</p>
            <div className="acciones-nota">
              <button className="boton-accion" onClick={() => empezarAEditar(nota)}>✎</button>
              <button className="boton-accion" onClick={() => borrarNota(nota.id)}>×</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App