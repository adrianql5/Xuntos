-- ==========================================
-- DATOS INICIAIS PARA DEMOSTRACIÓN
-- ==========================================

-- Usuarios de demostración
-- Todas as contrasinais son: "demo123"
-- Hash xenérico (será recreado polo script de inicialización con bcrypt)

INSERT INTO usuarios (nome, email, password_hash, descricion) VALUES
('María González', 'maria@xuntos.gal', '$2b$10$placeholder', 'Estudo enxeñería informática no segundo ano. Apaixoada pola programación web e o deseño. Adoro compartir coñecemento e axudar aos compañeiros!'),
('Carlos Pérez', 'carlos@xuntos.gal', '$2b$10$placeholder', 'Estudante de matemáticas no terceiro ano. Apaixonado pola estatística, ciencia de datos e machine learning. Sempre disposto a resolver problemas complexos!'),
('Laura Fernández', 'laura@xuntos.gal', '$2b$10$placeholder', 'Estudante de física fascinada polas leis do universo. Especializada en mecánica, termodinámica e física experimental. Encántame compartir a beleza da física!'),
('David Silva', 'david@xuntos.gal', '$2b$10$placeholder', 'Estudante de filosofía e literatura galega. Interesado na historia, cultura e pensamento crítico. Amante dos libros e do debate intelectual.'),
('Ana Martínez', 'ana@xuntos.gal', '$2b$10$placeholder', 'Estudante de bioloxía e ciencias ambientais. Preocupada polo medio ambiente e a conservación. Investigo a biodiversidade de Galicia.');

-- Asignaturas de María (id: 1)
INSERT INTO usuario_asignaturas (usuario_id, asignatura) VALUES
(1, 'Programación Web'),
(1, 'Bases de Datos'),
(1, 'Algoritmos'),
(1, 'Estruturas de Datos');

-- Asignaturas de Carlos (id: 2)
INSERT INTO usuario_asignaturas (usuario_id, asignatura) VALUES
(2, 'Estatística'),
(2, 'Álxebra Lineal'),
(2, 'Cálculo'),
(2, 'Probabilidade'),
(2, 'Análise de Datos');

-- Asignaturas de Laura (id: 3)
INSERT INTO usuario_asignaturas (usuario_id, asignatura) VALUES
(3, 'Mecánica Cuántica'),
(3, 'Termodinámica'),
(3, 'Óptica'),
(3, 'Electromagnetismo'),
(3, 'Física Experimental');

-- Asignaturas de David (id: 4)
INSERT INTO usuario_asignaturas (usuario_id, asignatura) VALUES
(4, 'Filosofía Moderna'),
(4, 'Literatura Galega'),
(4, 'Ética'),
(4, 'Historia da Arte'),
(4, 'Pensamento Crítico');

-- Asignaturas de Ana (id: 5)
INSERT INTO usuario_asignaturas (usuario_id, asignatura) VALUES
(5, 'Ecoloxía'),
(5, 'Botánica'),
(5, 'Zooloxía'),
(5, 'Xenética'),
(5, 'Ciencias Ambientais');

-- Apuntes de María
INSERT INTO apuntes (usuario_id, nome, tipo, contido) VALUES
(1, 'Introdución a JavaScript', 'texto', 'JavaScript é unha linguaxe de programación que permite crear contido dinámico en páxinas web.

🔑 Conceptos básicos:

• Variables (let, const, var)
• Funcións e arrow functions
• Obxectos e arrays
• DOM manipulation
• Eventos e callbacks

📝 Exemplo básico:

let nome = "María";
const mensaxe = `Ola ${nome}!`;
console.log(mensaxe);

// Arrow function
const saludar = (nome) => {
    return `Benvido/a ${nome}`;
};

// Manipular DOM
document.getElementById("exemplo").textContent = saludar(nome);'),

(1, 'SQL - Guía rápida', 'texto', '📊 SQL (Structured Query Language)

==== CONSULTAS BÁSICAS ====

SELECT * FROM usuarios;
SELECT nome, email FROM usuarios WHERE idade > 18;

==== JOINS ====

SELECT u.nome, p.titulo
FROM usuarios u
INNER JOIN posts p ON u.id = p.usuario_id;

==== INSERCIÓNS ====

INSERT INTO usuarios (nome, email) VALUES (''Ana'', ''ana@example.com'');

==== ACTUALIZACIÓNS ====

UPDATE usuarios SET email = ''novo@email.com'' WHERE id = 1;

==== BORRADO ====

DELETE FROM usuarios WHERE id = 5;

💡 Consello: Sempre fai BACKUP antes de DELETE ou UPDATE!');

-- Apuntes de Carlos
INSERT INTO apuntes (usuario_id, nome, tipo, contido) VALUES
(2, 'Distribucións de Probabilidade', 'texto', '📈 DISTRIBUCIÓNS DE PROBABILIDADE

==== DISTRIBUCIÓN NORMAL ====

• Media (μ) e desviación estándar (σ)
• Forma de campá
• Regra 68-95-99.7

68% dos datos están entre μ ± σ
95% dos datos están entre μ ± 2σ
99.7% dos datos están entre μ ± 3σ

==== DISTRIBUCIÓN BINOMIAL ====

P(X=k) = C(n,k) × p^k × (1-p)^(n-k)

Donde:
n = número de ensaios
k = número de éxitos
p = probabilidade de éxito

==== DISTRIBUCIÓN DE POISSON ====

P(X=k) = (λ^k × e^(-λ)) / k!

Útil para eventos raros en intervalos de tempo.

💡 Aplica en: chegadas de clientes, erros en produción, etc.'),

(2, 'Álxebra Lineal - Matrices', 'texto', '🔢 ÁLXEBRA LINEAL: MATRICES

==== OPERACIÓNS BÁSICAS ====

1. SUMA DE MATRICES
   [a b]   [e f]   [a+e b+f]
   [c d] + [g h] = [c+g d+h]

2. MULTIPLICACIÓN POR ESCALAR
   k × [a b] = [ka kb]
       [c d]   [kc kd]

3. MULTIPLICACIÓN DE MATRICES
   Requisito: columnas de A = filas de B
   C[i,j] = Σ A[i,k] × B[k,j]

==== DETERMINANTE (2×2) ====

det([a b]) = ad - bc
    [c d]

==== MATRIZ INVERSA ====

A × A^(-1) = I (matriz identidade)

Existe se det(A) ≠ 0

💡 Aplicacións: sistemas de ecuacións, transformacións xeométricas, gráficos 3D');

-- Apuntes de Laura
INSERT INTO apuntes (usuario_id, nome, tipo, contido) VALUES
(3, 'Leis de Newton', 'texto', '⚛️ AS TRES LEIS DE NEWTON

==== 1ª LEI: LEI DA INERCIA ====

Un corpo permanece en repouso ou en movemento rectilíneo uniforme a non ser que actúe unha forza externa neta sobre el.

📝 Exemplo: Un libro nunha mesa queda alí ata que alguén o move.

==== 2ª LEI: LEI FUNDAMENTAL DA DINÁMICA ====

F = m × a

Donde:
F = forza (Newton)
m = masa (kg)
a = aceleración (m/s²)

📝 Exemplo: Para acelerar un coche de 1000kg a 2m/s², necesítanse 2000N de forza.

==== 3ª LEI: ACCIÓN E REACCIÓN ====

Para cada acción hai unha reacción igual e oposta.

Se un obxecto A exerce unha forza sobre B, entón B exerce unha forza igual en magnitude pero oposta en dirección sobre A.

📝 Exemplo: Cando camiñas, empurras o chan cara atrás, e o chan empúrrate a ti cara adiante.

💡 Estas leis son fundamentais para entender TODO o movemento!'),

(3, 'Leis da Termodinámica', 'texto', '🌡️ LEIS DA TERMODINÁMICA

==== LEI CERO ====

Se A está en equilibrio térmico con B, e B está en equilibrio térmico con C, entón A está en equilibrio térmico con C.

Fundamento da medición de temperatura.

==== PRIMEIRA LEI ====

ΔU = Q - W

A enerxía do universo é constante.

ΔU = cambio na enerxía interna
Q = calor absorbido
W = traballo realizado

==== SEGUNDA LEI ====

A entropía do universo sempre aumenta.

Os procesos espontáneos van cara ao desorde.

ηcarnot = 1 - (Tc/Th) < 100%

Ningún motor térmico pode ser 100% eficiente.

==== TERCEIRA LEI ====

É imposible alcanzar o cero absoluto (0 K = -273.15°C).

A entropía dun cristal perfecto a 0K é cero.

💡 Estas leis rexen todo: motores, refrixeradores, vida, universo!');

-- Apuntes de David
INSERT INTO apuntes (usuario_id, nome, tipo, contido) VALUES
(4, 'Filósofos Presocráticos', 'texto', '🏛️ FILÓSOFOS PRESOCRÁTICOS

==== TALES DE MILETO ====

"Todo é auga" - Buscaba o principio (arché) de todas as cousas.

Primeiro en buscar explicacións naturais, non mitolóxicas.

==== PITÁGORAS ====

"Todo é número" - Os números son a esencia da realidade.

Descubriu relacións matemáticas na música e natureza.

Teorema: a² + b² = c²

==== HERÁCLITO ====

"Todo flúe" (Panta rhei)

O cambio é a única constante.

"Non podes bañarte dúas veces no mesmo río."

==== PARMÉNIDES ====

O ser é, o non-ser non é.

O cambio é unha ilusión, só existe o ser eterno e inmutable.

Contrario a Heráclito!

==== DEMÓCRITO ====

Todo está composto de átomos (atomos = indivisible)

Precursor da física atómica moderna.

💡 Estes pensadores fixeron as preguntas fundamentais que aínda nos facemos hoxe.');

-- Apuntes de Ana
INSERT INTO apuntes (usuario_id, nome, tipo, contido) VALUES
(5, 'Fotosíntese - Proceso detallado', 'texto', '🌱 FOTOSÍNTESE

==== ECUACIÓN XERAL ====

6 CO₂ + 6 H₂O + enerxía solar → C₆H₁₂O₆ + 6 O₂

==== FASE LUMÍNICA (nos tilacoides) ====

1. Absorción de luz polos pigmentos (clorofila)
2. Fotólise da auga: H₂O → O₂ + H⁺ + e⁻
3. Produción de ATP e NADPH

Resultado: enerxía química almacenada

==== FASE ESCURA ou Ciclo de Calvin (no estroma) ====

1. Fixación de CO₂ (RuBisCO)
2. Redución (usa ATP e NADPH)
3. Rexeneración de RuBP

Resultado: glicosa (C₆H₁₂O₆)

==== FACTORES QUE AFECTAN ====

• Intensidade luminosa
• Concentración de CO₂
• Temperatura
• Dispoñibilidade de auga

💡 Sen fotosíntese non existiría vida como a coñecemos. As plantas producen o oxíxeno que respiramos e son a base da cadea alimentaria!'),

(5, 'Ecosistemas de Galicia', 'texto', '🌲 ECOSISTEMAS DE GALICIA

==== FRAGAS (Bosques autóctonos) ====

Árbores principais:
• Carballo (Quercus robur)
• Bidueiro (Betula alba)
• Castiñeiro (Castanea sativa)

Fauna: xabaril, raposo, lobo, paxaros diversos

Problema: substitución por eucaliptos

==== COSTA E RÍAS ====

Biodiversidade mariña moi rica:
• Percebe, mexillón, navalla
• Polbo, choco, luras
• Peixe: xurelo, sardiña, merluza

As rías son ecosistemas únicos (estuarios)

==== MONTAÑAS ====

Os Ancares, Serra do Courel, Serra da Enciña da Lastra

Especies protexidas:
• Oso pardo (en recuperación)
• Urogallo (en perigo crítico)
• Lagartija da Enciña da Lastra (endémica)

==== HUMIDAIS ====

Lagoa de Cospeito, Lagoa de Antela (desecada), As Fragas do Eume

Fundamentais para aves migratorias

💡 Galicia é un punto quente de biodiversidade na Península Ibérica. Temos que protexela!');

-- Mensaxes (usando timestamps calculados)
INSERT INTO mensaxes (de, para, texto, timestamp) VALUES
-- Conversas entre María e Carlos
(1, 2, 'Ola Carlos! Vin que dominas estatística. Pódeme axudar cun proxecto de análise de datos?', EXTRACT(EPOCH FROM (NOW() - INTERVAL '2 days')) * 1000),
(2, 1, 'Claro María! Encantado de axudar. De que trata o proxecto?', EXTRACT(EPOCH FROM (NOW() - INTERVAL '2 days' + INTERVAL '5 minutes')) * 1000),
(1, 2, 'Teño que analizar datos de vendas dunha tenda online. Necesito facer unha regresión lineal.', EXTRACT(EPOCH FROM (NOW() - INTERVAL '2 days' + INTERVAL '10 minutes')) * 1000),
(2, 1, 'Perfecto! Pódoche pasar os meus apuntes de regresión e axudarte paso a paso. Tes Python instalado?', EXTRACT(EPOCH FROM (NOW() - INTERVAL '2 days' + INTERVAL '15 minutes')) * 1000),
(1, 2, 'Si, teño Python e coñezo un pouco de pandas. Sería xenial se me pases os apuntes!', EXTRACT(EPOCH FROM (NOW() - INTERVAL '2 days' + INTERVAL '20 minutes')) * 1000),

-- Conversas entre Laura e María
(3, 1, 'Hola María! Preciso axuda con JavaScript para unha simulación de física. Podes axudarme?', EXTRACT(EPOCH FROM (NOW() - INTERVAL '1 day')) * 1000),
(1, 3, 'Ola Laura! Por suposto. Que tipo de simulación queres facer?', EXTRACT(EPOCH FROM (NOW() - INTERVAL '1 day' + INTERVAL '10 minutes')) * 1000),
(3, 1, 'Quero simular o movemento dun proxectil coas leis de Newton. Cun canvas de HTML5.', EXTRACT(EPOCH FROM (NOW() - INTERVAL '1 day' + INTERVAL '20 minutes')) * 1000),
(1, 3, 'Que chulo! Podes usar requestAnimationFrame para a animación. Pódoche pasar un exemplo básico.', EXTRACT(EPOCH FROM (NOW() - INTERVAL '1 day' + INTERVAL '30 minutes')) * 1000),

-- Conversas entre Carlos e Ana
(2, 5, 'Ola Ana! Vin os teus apuntes de ecosistemas. Estou facendo estatística sobre biodiversidade, tes datos?', EXTRACT(EPOCH FROM (NOW() - INTERVAL '5 hours')) * 1000),
(5, 2, 'Ola Carlos! Si, teño datos de especies nas fragas galegas. Con moito gusto compártoches!', EXTRACT(EPOCH FROM (NOW() - INTERVAL '4 hours')) * 1000),
(2, 5, 'Xenial! Pódoche facer unha análise descritiva e ver tendencias de poboación.', EXTRACT(EPOCH FROM (NOW() - INTERVAL '3 hours')) * 1000),

-- Conversas entre David e Laura
(4, 3, 'Laura, estou fascinado pola relación entre filosofía e física. Pódemos falar sobre a natureza do tempo?', EXTRACT(EPOCH FROM (NOW() - INTERVAL '2 hours')) * 1000),
(3, 4, 'David! Que interesante! A física moderna (relatividade e cuántica) cambiou totalmente como entendemos o tempo.', EXTRACT(EPOCH FROM (NOW() - INTERVAL '90 minutes')) * 1000),
(4, 3, 'Si! Parménides dicía que o tempo é unha ilusión. Einstein demostrou que é relativo. Alucinante!', EXTRACT(EPOCH FROM (NOW() - INTERVAL '1 hour')) * 1000),

-- Conversas entre María e Ana
(1, 5, 'Ana, podes explicarme a fotosíntese? Estou facendo unha web educativa e quero asegurarme de que está ben.', EXTRACT(EPOCH FROM (NOW() - INTERVAL '30 minutes')) * 1000),
(5, 1, 'Claro! A fotosíntese ten dúas fases principais: a lumínica e a escura. Mira os meus apuntes, está todo detallado!', EXTRACT(EPOCH FROM (NOW() - INTERVAL '15 minutes')) * 1000),
(1, 5, 'Perfecto! Veríndoos agora. Moitas grazas!', EXTRACT(EPOCH FROM (NOW() - INTERVAL '5 minutes')) * 1000);
