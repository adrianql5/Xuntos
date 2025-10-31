// ==========================================
// DATOS INICIAIS PARA DEMOSTRACIÓN
// ==========================================

// Base de datos en memoria para a demostración
const BaseDatos = {
    usuarios: [
        {
            id: 1,
            nome: 'María González',
            descricion: 'Estudo enxeñería informática no segundo ano. Apaixoada pola programación web e o deseño. Adoro compartir coñecemento e axudar aos compañeiros!',
            asignaturas: ['Programación Web', 'Bases de Datos', 'Algoritmos', 'Estruturas de Datos'],
            apuntes: [
                {
                    id: 1,
                    nome: 'Introdución a JavaScript',
                    tipo: 'texto',
                    contido: 'JavaScript é unha linguaxe de programación que permite crear contido dinámico en páxinas web.\n\n🔑 Conceptos básicos:\n\n• Variables (let, const, var)\n• Funcións e arrow functions\n• Obxectos e arrays\n• DOM manipulation\n• Eventos e callbacks\n\n📝 Exemplo básico:\n\nlet nome = "María";\nconst mensaxe = `Ola ${nome}!`;\nconsole.log(mensaxe);\n\n// Arrow function\nconst saludar = (nome) => {\n    return `Benvido/a ${nome}`;\n};\n\n// Manipular DOM\ndocument.getElementById("exemplo").textContent = saludar(nome);'
                },
                {
                    id: 2,
                    nome: 'SQL - Guía rápida',
                    tipo: 'texto',
                    contido: '📊 SQL (Structured Query Language)\n\n==== CONSULTAS BÁSICAS ====\n\nSELECT * FROM usuarios;\nSELECT nome, email FROM usuarios WHERE idade > 18;\n\n==== JOINS ====\n\nSELECT u.nome, p.titulo\nFROM usuarios u\nINNER JOIN posts p ON u.id = p.usuario_id;\n\n==== INSERCIÓNS ====\n\nINSERT INTO usuarios (nome, email) VALUES (\'Ana\', \'ana@example.com\');\n\n==== ACTUALIZACIÓNS ====\n\nUPDATE usuarios SET email = \'novo@email.com\' WHERE id = 1;\n\n==== BORRADO ====\n\nDELETE FROM usuarios WHERE id = 5;\n\n💡 Consello: Sempre fai BACKUP antes de DELETE ou UPDATE!'
                }
            ]
        },
        {
            id: 2,
            nome: 'Carlos Pérez',
            descricion: 'Estudante de matemáticas no terceiro ano. Apaixonado pola estatística, ciencia de datos e machine learning. Sempre disposto a resolver problemas complexos!',
            asignaturas: ['Estatística', 'Álxebra Lineal', 'Cálculo', 'Probabilidade', 'Análise de Datos'],
            apuntes: [
                {
                    id: 3,
                    nome: 'Distribucións de Probabilidade',
                    tipo: 'texto',
                    contido: '📈 DISTRIBUCIÓNS DE PROBABILIDADE\n\n==== DISTRIBUCIÓN NORMAL ====\n\n• Media (μ) e desviación estándar (σ)\n• Forma de campá\n• Regra 68-95-99.7\n\n68% dos datos están entre μ ± σ\n95% dos datos están entre μ ± 2σ\n99.7% dos datos están entre μ ± 3σ\n\n==== DISTRIBUCIÓN BINOMIAL ====\n\nP(X=k) = C(n,k) × p^k × (1-p)^(n-k)\n\nDonde:\nn = número de ensaios\nk = número de éxitos\np = probabilidade de éxito\n\n==== DISTRIBUCIÓN DE POISSON ====\n\nP(X=k) = (λ^k × e^(-λ)) / k!\n\nÚtil para eventos raros en intervalos de tempo.\n\n💡 Aplica en: chegadas de clientes, erros en produción, etc.'
                },
                {
                    id: 4,
                    nome: 'Álxebra Lineal - Matrices',
                    tipo: 'texto',
                    contido: '🔢 ÁLXEBRA LINEAL: MATRICES\n\n==== OPERACIÓNS BÁSICAS ====\n\n1. SUMA DE MATRICES\n   [a b]   [e f]   [a+e b+f]\n   [c d] + [g h] = [c+g d+h]\n\n2. MULTIPLICACIÓN POR ESCALAR\n   k × [a b] = [ka kb]\n       [c d]   [kc kd]\n\n3. MULTIPLICACIÓN DE MATRICES\n   Requisito: columnas de A = filas de B\n   C[i,j] = Σ A[i,k] × B[k,j]\n\n==== DETERMINANTE (2×2) ====\n\ndet([a b]) = ad - bc\n    [c d]\n\n==== MATRIZ INVERSA ====\n\nA × A^(-1) = I (matriz identidade)\n\nExiste se det(A) ≠ 0\n\n💡 Aplicacións: sistemas de ecuacións, transformacións xeométricas, gráficos 3D'
                }
            ]
        },
        {
            id: 3,
            nome: 'Laura Fernández',
            descricion: 'Estudante de física fascinada polas leis do universo. Especializada en mecánica, termodinámica e física experimental. Encántame compartir a beleza da física!',
            asignaturas: ['Mecánica Cuántica', 'Termodinámica', 'Óptica', 'Electromagnetismo', 'Física Experimental'],
            apuntes: [
                {
                    id: 5,
                    nome: 'Leis de Newton',
                    tipo: 'texto',
                    contido: '⚛️ AS TRES LEIS DE NEWTON\n\n==== 1ª LEI: LEI DA INERCIA ====\n\nUn corpo permanece en repouso ou en movemento rectilíneo uniforme a non ser que actúe unha forza externa neta sobre el.\n\n📝 Exemplo: Un libro nunha mesa queda alí ata que alguén o move.\n\n==== 2ª LEI: LEI FUNDAMENTAL DA DINÁMICA ====\n\nF = m × a\n\nDonde:\nF = forza (Newton)\nm = masa (kg)\na = aceleración (m/s²)\n\n📝 Exemplo: Para acelerar un coche de 1000kg a 2m/s², necesítanse 2000N de forza.\n\n==== 3ª LEI: ACCIÓN E REACCIÓN ====\n\nPara cada acción hai unha reacción igual e oposta.\n\nSe un obxecto A exerce unha forza sobre B, entón B exerce unha forza igual en magnitude pero oposta en dirección sobre A.\n\n📝 Exemplo: Cando camiñas, empurras o chan cara atrás, e o chan empúrrate a ti cara adiante.\n\n💡 Estas leis son fundamentais para entender TODO o movemento!'
                },
                {
                    id: 6,
                    nome: 'Leis da Termodinámica',
                    tipo: 'texto',
                    contido: '🌡️ LEIS DA TERMODINÁMICA\n\n==== LEI CERO ====\n\nSe A está en equilibrio térmico con B, e B está en equilibrio térmico con C, entón A está en equilibrio térmico con C.\n\nFundamento da medición de temperatura.\n\n==== PRIMEIRA LEI ====\n\nΔU = Q - W\n\nA enerxía do universo é constante.\n\nΔU = cambio na enerxía interna\nQ = calor absorbido\nW = traballo realizado\n\n==== SEGUNDA LEI ====\n\nA entropía do universo sempre aumenta.\n\nOs procesos espontáneos van cara ao desorde.\n\nηcarnot = 1 - (Tc/Th) < 100%\n\nNingún motor térmico pode ser 100% eficiente.\n\n==== TERCEIRA LEI ====\n\nÉ imposible alcanzar o cero absoluto (0 K = -273.15°C).\n\nA entropía dun cristal perfecto a 0K é cero.\n\n💡 Estas leis rexen todo: motores, refrixeradores, vida, universo!'
                }
            ]
        },
        {
            id: 4,
            nome: 'David Silva',
            descricion: 'Estudante de filosofía e literatura galega. Interesado na historia, cultura e pensamento crítico. Amante dos libros e do debate intelectual.',
            asignaturas: ['Filosofía Moderna', 'Literatura Galega', 'Ética', 'Historia da Arte', 'Pensamento Crítico'],
            apuntes: [
                {
                    id: 7,
                    nome: 'Filósofos Presocráticos',
                    tipo: 'texto',
                    contido: '🏛️ FILÓSOFOS PRESOCRÁTICOS\n\n==== TALES DE MILETO ====\n\n"Todo é auga" - Buscaba o principio (arché) de todas as cousas.\n\nPrimeiro en buscar explicacións naturais, non mitolóxicas.\n\n==== PITÁGORAS ====\n\n"Todo é número" - Os números son a esencia da realidade.\n\nDescubriu relacións matemáticas na música e natureza.\n\nTeorema: a² + b² = c²\n\n==== HERÁCLITO ====\n\n"Todo flúe" (Panta rhei)\n\nO cambio é a única constante.\n\n"Non podes bañarte dúas veces no mesmo río."\n\n==== PARMÉNIDES ====\n\nO ser é, o non-ser non é.\n\nO cambio é unha ilusión, só existe o ser eterno e inmutable.\n\nContrario a Heráclito!\n\n==== DEMÓCRITO ====\n\nTodo está composto de átomos (atomos = indivisible)\n\nPrecursor da física atómica moderna.\n\n💡 Estes pensadores fixeron as preguntas fundamentais que aínda nos facemos hoxe.'
                }
            ]
        },
        {
            id: 5,
            nome: 'Ana Martínez',
            descricion: 'Estudante de bioloxía e ciencias ambientais. Preocupada polo medio ambiente e a conservación. Investigo a biodiversidade de Galicia.',
            asignaturas: ['Ecoloxía', 'Botánica', 'Zooloxía', 'Xenética', 'Ciencias Ambientais'],
            apuntes: [
                {
                    id: 8,
                    nome: 'Fotosíntese - Proceso detallado',
                    tipo: 'texto',
                    contido: '🌱 FOTOSÍNTESE\n\n==== ECUACIÓN XERAL ====\n\n6 CO₂ + 6 H₂O + enerxía solar → C₆H₁₂O₆ + 6 O₂\n\n==== FASE LUMÍNICA (nos tilacoides) ====\n\n1. Absorción de luz polos pigmentos (clorofila)\n2. Fotólise da auga: H₂O → O₂ + H⁺ + e⁻\n3. Produción de ATP e NADPH\n\nResultado: enerxía química almacenada\n\n==== FASE ESCURA ou Ciclo de Calvin (no estroma) ====\n\n1. Fixación de CO₂ (RuBisCO)\n2. Redución (usa ATP e NADPH)\n3. Rexeneración de RuBP\n\nResultado: glicosa (C₆H₁₂O₆)\n\n==== FACTORES QUE AFECTAN ====\n\n• Intensidade luminosa\n• Concentración de CO₂\n• Temperatura\n• Dispoñibilidade de auga\n\n💡 Sen fotosíntese non existiría vida como a coñecemos. As plantas producen o oxíxeno que respiramos e son a base da cadea alimentaria!'
                },
                {
                    id: 9,
                    nome: 'Ecosistemas de Galicia',
                    tipo: 'texto',
                    contido: '🌲 ECOSISTEMAS DE GALICIA\n\n==== FRAGAS (Bosques autóctonos) ====\n\nÁrbores principais:\n• Carballo (Quercus robur)\n• Bidueiro (Betula alba)\n• Castiñeiro (Castanea sativa)\n\nFauna: xabaril, raposo, lobo, paxaros diversos\n\nProblema: substitución por eucaliptos\n\n==== COSTA E RÍAS ====\n\nBiodiversidade mariña moi rica:\n• Percebe, mexillón, navalla\n• Polbo, choco, luras\n• Peixe: xurelo, sardiña, merluza\n\nAs rías son ecosistemas únicos (estuarios)\n\n==== MONTAÑAS ====\n\nOs Ancares, Serra do Courel, Serra da Enciña da Lastra\n\nEspecies protexidas:\n• Oso pardo (en recuperación)\n• Urogallo (en perigo crítico)\n• Lagartija da Enciña da Lastra (endémica)\n\n==== HUMIDAIS ====\n\nLagoa de Cospeito, Lagoa de Antela (desecada), As Fragas do Eume\n\nFundamentais para aves migratorias\n\n💡 Galicia é un punto quente de biodiversidade na Península Ibérica. Temos que protexela!'
                }
            ]
        }
    ],

    mensaxes: [
        // Conversas entre María e Carlos
        {
            id: 1,
            de: 1,
            para: 2,
            texto: 'Ola Carlos! Vin que dominas estatística. Pódeme axudar cun proxecto de análise de datos?',
            timestamp: Date.now() - 86400000 * 2 // Hai 2 días
        },
        {
            id: 2,
            de: 2,
            para: 1,
            texto: 'Claro María! Encantado de axudar. De que trata o proxecto?',
            timestamp: Date.now() - 86400000 * 2 + 300000
        },
        {
            id: 3,
            de: 1,
            para: 2,
            texto: 'Teño que analizar datos de vendas dunha tenda online. Necesito facer unha regresión lineal.',
            timestamp: Date.now() - 86400000 * 2 + 600000
        },
        {
            id: 4,
            de: 2,
            para: 1,
            texto: 'Perfecto! Pódoche pasar os meus apuntes de regresión e axudarte paso a paso. Tes Python instalado?',
            timestamp: Date.now() - 86400000 * 2 + 900000
        },
        {
            id: 5,
            de: 1,
            para: 2,
            texto: 'Si, teño Python e coñezo un pouco de pandas. Sería xenial se me pases os apuntes!',
            timestamp: Date.now() - 86400000 * 2 + 1200000
        },

        // Conversas entre Laura e María
        {
            id: 6,
            de: 3,
            para: 1,
            texto: 'Hola María! Preciso axuda con JavaScript para unha simulación de física. Podes axudarme?',
            timestamp: Date.now() - 86400000 // Hai 1 día
        },
        {
            id: 7,
            de: 1,
            para: 3,
            texto: 'Ola Laura! Por suposto. Que tipo de simulación queres facer?',
            timestamp: Date.now() - 86400000 + 600000
        },
        {
            id: 8,
            de: 3,
            para: 1,
            texto: 'Quero simular o movemento dun proxectil coas leis de Newton. Cun canvas de HTML5.',
            timestamp: Date.now() - 86400000 + 1200000
        },
        {
            id: 9,
            de: 1,
            para: 3,
            texto: 'Que chulo! Podes usar requestAnimationFrame para a animación. Pódoche pasar un exemplo básico.',
            timestamp: Date.now() - 86400000 + 1800000
        },

        // Conversas entre Carlos e Ana
        {
            id: 10,
            de: 2,
            para: 5,
            texto: 'Ola Ana! Vin os teus apuntes de ecosistemas. Estou facendo estatística sobre biodiversidade, tes datos?',
            timestamp: Date.now() - 3600000 * 5 // Hai 5 horas
        },
        {
            id: 11,
            de: 5,
            para: 2,
            texto: 'Ola Carlos! Si, teño datos de especies nas fragas galegas. Con moito gusto compártoches!',
            timestamp: Date.now() - 3600000 * 4
        },
        {
            id: 12,
            de: 2,
            para: 5,
            texto: 'Xenial! Pódoche facer unha análise descritiva e ver tendencias de poboación.',
            timestamp: Date.now() - 3600000 * 3
        },

        // Conversas entre David e Laura
        {
            id: 13,
            de: 4,
            para: 3,
            texto: 'Laura, estou fascinado pola relación entre filosofía e física. Pódemos falar sobre a natureza do tempo?',
            timestamp: Date.now() - 7200000 // Hai 2 horas
        },
        {
            id: 14,
            de: 3,
            para: 4,
            texto: 'David! Que interesante! A física moderna (relatividade e cuántica) cambiou totalmente como entendemos o tempo.',
            timestamp: Date.now() - 5400000
        },
        {
            id: 15,
            de: 4,
            para: 3,
            texto: 'Si! Parménides dicía que o tempo é unha ilusión. Einstein demostrou que é relativo. Alucinante!',
            timestamp: Date.now() - 3600000
        },

        // Conversas entre María e Ana
        {
            id: 16,
            de: 1,
            para: 5,
            texto: 'Ana, podes explicarme a fotosíntese? Estou facendo unha web educativa e quero asegurarme de que está ben.',
            timestamp: Date.now() - 1800000 // Hai 30 min
        },
        {
            id: 17,
            de: 5,
            para: 1,
            texto: 'Claro! A fotosíntese ten dúas fases principais: a lumínica e a escura. Mira os meus apuntes, está todo detallado!',
            timestamp: Date.now() - 900000
        },
        {
            id: 18,
            de: 1,
            para: 5,
            texto: 'Perfecto! Veríndoos agora. Moitas grazas! 😊',
            timestamp: Date.now() - 300000
        }
    ],

    // Contadores para novos elementos
    proximoIdUsuario: 6,
    proximoIdApunte: 10,
    proximoIdMensaxe: 19
};

module.exports = BaseDatos;
