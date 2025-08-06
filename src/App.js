import React, { useEffect, useState } from 'react';
import './style.css';

function App() {
  const [dados, setDados] = useState(null);
  const [comodoSelecionado, setComodoSelecionado] = useState("");

  useEffect(() => {
    fetch('/dadosResidencia.json')
      .then((res) => res.json())
      .then((data) => setDados(data));
  }, []);

  const handleToggle = (comodoKey, dispositivoId) => {
    const novosDados = { ...dados };
    const dispositivo = novosDados.residencia[comodoKey].dispositivos.find(
      (d) => d.id === dispositivoId
    );
    if (dispositivo && dispositivo.estado) {
      dispositivo.estado.ligado = !dispositivo.estado.ligado;
      dispositivo.estado.consumoWatts = dispositivo.estado.ligado
        ? dispositivo.estado.consumoWatts || 10
        : 0;
    }
    setDados(novosDados);
  };

  if (!dados) return <p>Carregando dados da residência...</p>;

  const comodos = Object.keys(dados.residencia);
  const dispositivos =
    comodoSelecionado && dados.residencia[comodoSelecionado]
      ? dados.residencia[comodoSelecionado].dispositivos
      : [];

  return (
    <div className="container">
      <h1>Residência Inteligente</h1>

      <select
        onChange={(e) => setComodoSelecionado(e.target.value)}
        value={comodoSelecionado}
      >
        <option value="">-- Selecione um cômodo --</option>
        {comodos.map((key) => (
          <option key={key} value={key}>
            {dados.residencia[key].nome}
          </option>
        ))}
      </select>

      {comodoSelecionado && (
        <div className="dispositivos">
          <h2>{dados.residencia[comodoSelecionado].nome}</h2>
          {dispositivos.map((disp) => (
            <div className="dispositivo" key={disp.id}>
              <h3>{disp.nome} <span>({disp.tipo})</span></h3>
              <p>
                Estado:{" "}
                <strong className={disp.estado.ligado ? "ligado" : "desligado"}>
                  {disp.estado.ligado ? "Ligado" : "Desligado"}
                </strong>
              </p>
              <p>Consumo: {disp.estado.consumoWatts}W</p>
              <button onClick={() => handleToggle(comodoSelecionado, disp.id)}>
                {disp.estado.ligado ? "Desligar" : "Ligar"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;