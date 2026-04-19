const fs = require('fs');
let html = fs.readFileSync('carta-final.html', 'utf8');

// 1. CSS Updates
html = html.replace('body {', 'body {\n  overflow-x: hidden;\n}\nbody.locked {\n  overflow: hidden;\n}');
html = html.replace('.book-page {', '.hidden-section {\n  display: none !important;\n}\n\n.book-page {');

// Update .page-content css to disable scroll
html = html.replace(
  '.page-content {\n  flex: 1;\n  overflow-y: auto;\n  color: #2c241b;\n  padding-right: 5px; /* Para el scroll si hay */\n}',
  '.page-content {\n  flex: 1;\n  overflow: hidden;\n  color: #2c241b;\n  padding-right: 0px;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n}'
);

// Add initial classes
html = html.replace('<body>', '<body class="locked">');
html = html.replace('<section id="section-book">', '<section id="section-book" class="hidden-section">');
html = html.replace('<section id="section-collage">', '<section id="section-collage" class="hidden-section">');

// Update buttons in HTML 
html = html.replace(
  '<button class="abrir-btn" id="abrirBtn" onclick="document.getElementById(\'section-book\').scrollIntoView({behavior:\'smooth\'})">Abrir Carta 💌</button>',
  '<button class="abrir-btn" id="abrirBtn">Abrir Carta 💌</button>'
);
html = html.replace(
  '<button class="recuerdos-btn" id="recuerdosBtn" style="display:none;" onclick="document.getElementById(\'section-collage\').scrollIntoView({behavior:\'smooth\'})">',
  '<button class="recuerdos-btn" id="recuerdosBtn" style="display:none;">'
);

// 2. Remove all existing pages within bookWrapper
const bookWrapperStart = html.indexOf('<div class="book-wrapper" id="bookWrapper">');
const bookWrapperEnd = html.indexOf('<div class="book-controls">');
if(bookWrapperStart !== -1 && bookWrapperEnd !== -1) {
  html = html.substring(0, bookWrapperStart) + 
         '<div class="book-wrapper" id="bookWrapper">\n    <!-- Dinámicamente generado -->\n  </div>\n\n  ' + 
         html.substring(bookWrapperEnd);
}

// 3. JS Data and Logic Injection
const jsReplacementStart = html.indexOf('/* 3. LÓGICA DEL LIBRO MÓVIL */');
const jsReplacementEnd = html.indexOf('/* 4. MODAL FINAL */');

const newJS = `/* 3. LÓGICA DEL LIBRO MÓVIL Y DATOS */
const pagesData = [
  { isCover: true, title: "Mi Última<br>Carta", subtitle: "Con todo mi corazón<br>para Emelis 🌷" },
  { title: "Mi última carta (espero que no)", text: "<p>Esto posiblemente sea mi última carta. Mi último acto de amor, como muchos lo llamarían. Y me da vergüenza que sea digital. Yo quería que mi último acto de amor fuera un ramo de flores, las que más te gustan: tulipanes.</p>" },
  { text: "<p>Soy ese hombre detallista, no por necesidad, sino por naturaleza. Siempre he dicho que en esta vida hay que amar lo más que se pueda. Y quería entregarte el ramo de tulipanes más hermoso...</p>" },
  { text: "<p>...y miles de cartas que hablaran de lo valiosa que eres, para que las leyeras y recordaras siempre lo importante que eres y todo lo que puedes llegar a ser. Porque te mereces lo mejor.</p>" },
  { text: "<p>Me da vergüenza porque, aunque esta carta la escribo con mi mano y pongo todo mi empeño en que sea bonita, créeme que preferiría mil veces la opción de las flores y el papel.</p>" },
  { text: "<p>Porque sé que te gustan y sé que mereces lo mejor de lo mejor. Pero la vida quiso que estuvieras lejos.</p>" },
  { text: "<p>Aunque eso no es una excusa para mí. Me gusta resolver, ser útil en la vida de la persona que quiero, y la distancia nunca lo será.</p>" },
  { text: "<p>La verdad es más sencilla y humana: preferiría no hacerlo porque sé que te haría mucha ilusión, y tengo miedo de que solo me respondas por compromiso, aunque lo haga de corazón.</p>" },
  { text: "<p>Esta no es una carta de reclamos ni para pedirte nada. Solo son cosas que mi corazón y mi mente necesitan decirte. También es una forma de desahogarme.</p>" },
  { text: "<p>Creo que en otra vida fui poeta, cantante o compositor, no lo sé. Pero escribir y expresarme me ayuda, y creo que es mi mayor hobby.</p>" },
  { text: "<p>Antes de que sigas leyendo, quiero que sepas algo: no te escribo para recuperarte, ni para que me respondas. Quizás solo para sentirme mejor conmigo mismo.</p>" },
  { text: "<p>Te escribo porque, aunque no me lo pediste, me he tomado el tiempo de entender por qué actúas como actúas, y también porque es la mejor manera de poner en orden lo que siento.</p>" },
  { title: "Mi historia", text: "<p>Quiero empezar hablando de mí, de mi historia contigo, desde mi mirada. Siempre te dije que hay una faceta mía que es importante que conozcas para que me entiendas.</p>" },
  { text: "<p>Te juro que cuando la sepas, comprenderás mis comportamientos, mis actitudes raras. He querido decírtelo y sé que te lo mereces, pero preferiría hacerlo en persona. Ojalá podamos volvernos a ver algún día.</p>" },
  { text: "<p>Todo comenzó cuando me demoré en voltearte a ver. Y lo primero que vi fue tu cara. Ese día, tu outfit era espectacular: ese sombrero de vallenato te quedaba genial, tu vestido negro me encantó. Te veías divina, Emelis.</p>" },
  { text: "<p>Te vi y, si recuerdas, te dije: \\"¿Qué hubo? ¿Eres de Medellín, ¿verdad?\\" Luego te pregunté el barrio y recuerdo tu sonrisa. No sé si ya la estoy imaginando, pero sonreíste.</p>" },
  { text: "<p>Yo llegaba recién de un bazar y le dije a mi primo: \\"Esta nena está muy linda\\". Me da mucha risa porque, cuando entramos a la casa, no te presté atención; ni siquiera te volví a mirar, pero me moría de ganas de hablarte.</p>" },
  { text: "<p>Solo que pensé que eras algo de mi primo Wilmer. Pasaron dos o tres días y vimos al chico que te llevó en moto.</p>" },
  { text: "<p>Fuimos a comer con él y, en eso, dijo que la amiga de Wilmer había comentado que un chico de gafas le pareció lindo. Como ese día había varios con gafas, todos pensaron en todos, menos en mí.</p>" },
  { text: "<p>Porque, en realidad, al principio no me llamaste la atención superficialmente, aunque sí me gusta cada parte de tu cuerpo: tu boca, tu cintura, tu pelo, tu cara.</p>" },
  { text: "<p>Sobre todo tus cejas. Me pareces muy hermosa. Creo que te recordaré toda la vida, Emelis. Al principio me gustó eso, cada parte de tu cuerpo.</p>" },
  { text: "<p>Pero no sabíamos con quién era el comentario. Dije: \\"¿Cómo vamos a saber?\\" Tuve que insistirle a mi primo para que me dijera, y al final confesó:</p>" },
  { text: "<p>\\"La verdad, esa muchacha gustó de ti\\". Y yo no podía creerlo. Le pedí el contacto una y otra vez, hasta que un día llegó con su mejor amigo (creo que es muy amigo tuyo también, el de nombre como de perro, el blanquito).</p>" },
  { text: "<p>Les invité varias frías y, al final, mi primo dijo: \\"Bueno, tocará darle el número\\". Ese día no tenía mi celular, así que te escribí desde el celular de emel.</p>" },
  { text: "<p>Pasaron los días, y cuando comenzamos a hablar de verdad, fue algo muy lindo. En mi mente había dudas: \\"¿Será que esta muchacha es mala? ¿Será bandida?\\" (aunque, siendo honesto, aún no lo sé).</p>" },
  { text: "<p>Pero a los pocos días ya me quería casar contigo. Mi corazón te eligió, y ¿qué culpa tiene? No le pidas que entienda de preferencias ni de prioridades.</p>" },
  { text: "<p>Échale la culpa a mi corazón, no a mí. Pronto empecé a pensar: \\"¿Cómo la traigo a mi casa? ¿Qué dirán mis papás? Ella es menor\\".</p>" },
  { text: "<p>Y créeme, yo iba contra todos: contra la corriente, contra mi familia. Mi corazón me decía: \\"Si de verdad la quieres, párate firme y pelea hasta el final\\". Y eso nunca iba a ser un problema para mí.</p>" },
  { text: "<p>Les conté a mis primos, Emel y Lucas. Ellos me aconsejaban: \\"No le metas corazón, no la conoces, no sabes con quién anda\\". Consejos que no me sirvieron de nada.</p>" },
  { text: "<p>También me dijeron que no debía haberme expresado así tan pronto. Y tenían razón. Ahí supe que la había cagado y que necesitaba arreglarlo.</p>" },
  { text: "<p>Me dije: \\"No quiero quedar mal con ella porque me gustó su confianza. Voy a escribirle una carta con lo que siento\\". Y así lo hice.</p>" },
  { text: "<p>Te juro que nunca pensé que me responderías. Lo hice de corazón, como todo lo que te he demostrado. No es mentira: es la verdad. Por eso no le doy tanta vuelta al asunto: no perdí nada y no me arrepiento de nada.</p>" },
  { text: "<p>Ese día del paseo, mi primo Wilmer le contó a Emel, Emel a mi familia, y yo recibí tu mensaje. Me encantó, pero también me llevé una buena dosis de realidad:</p>" },
  { text: "<p>comentarios de: \\"Esa muchacha no te quiere, no te valora, no le interesas\\". Y yo solo podía responder: \\"Peleen con mi corazón, no conmigo\\".</p>" },
  { text: "<p>Mientras otro comentario me felicitó por el detalle, aunque sabían que quizás no sería correspondido. Y a mí me valió: lo hice sin esperar nada.</p>" },
  { text: "<p>El corazón es terco, y tú lo sabes bien. Seguí ahí, a veces sintiéndome menos, preguntándome qué hacía mal. Pensaba que quizás no te gustaba, que tendrías a alguien más, alguien más joven.</p>" },
  { text: "<p>Las inseguridades, siempre. Pero me decía: \\"No me voy a rendir. Quiero que sea ella, aunque tenga que hacer lo imposible \\". Mis primos me tenían la vida triste, pero no porque no me apoyaran, sino porque saben lo que valgo.</p>" },
  { text: "<p>Ellos me decían: \\"No le escribas más\\". Y yo, o, mejor dicho, mi corazón débil y terco, los ignoraba. Seguí ahí, como sea, pero seguía. Era una pelea diaria con ellos.</p>" },
  { text: "<p>Me decía habla con otras chicas y yo decía: \\"No, a mí me cautivó Emelis. Yo sé que ella esconde algo, su verdadera forma. Está dolida y yo quiero sanar su herida. Quiero apoyarla, aunque no le guste.</p>" },
  { text: "<p>Quiero quitarle la máscara, aunque pierda toda mi dignidad. Ella me mostró algo oculto, algo vulnerable. Necesita un apoyo y no quiero fallarle.</p>" },
  { text: "<p>Quiero ser yo quien le devuelva la confianza en querer a alguien quiero se yo la que la vulva a hacer la persona que fue\\". El día que te vi por primera vez no fui yo. No soy así.</p>" },
  { text: "<p>Pero tú tienes algo que hace latir mi corazón. El día que fui a ver a mi hijo, el impulso me consumió.</p>" },
  { text: "<p>Los días que nos volvimos a ver en la ventana fueron muy lindos para mí, aunque fueran pequeños tiempo y momento fue algo lindo para mí te veía y solo pensaba en lo hermosa que eres pensaba muchas cosas te deseaba más que nada del buen sentido de la palabra.</p>" },
  { text: "<p>Me sentía en la nube mi corazón comenzaba a latir rápido. Me quedé con ganas de ir a tocarte la guitarra, llevarte rosa, chocolates para ti, siempre suponía que no era tu mejor opción, y prefería no hacerlo.</p>" },
  { text: "<p>Cuando me pediste que no te hablara más, me sentí muy mal. Ese día o un día ante había comprado una caja de helado para compartir creo que te había dicho tengo algo guardado en la nevera.</p>" },
  { text: "<p>No buscaba nada más que pasar un buen rato, hablar, escucharte Solo eso no te iba exigir ni a pedir nada. Luego me diste la oportunidad de invitaste a vernos, al mirador, a comer fresas con crema a acompañarte.</p>" },
  { text: "<p>Me gustó sin importancia de tus intenciones, Pero algo me dio rabia me molesto porque me Moria de ganar de besarte de agárrate de la cintura de abrazarte de darte cariño y ese día llegue muy decepcionado conmigo mismo...</p>" },
  { text: "<p>...por eso también te había dicho que estaba decepcionando, pero no de ti si no de mí y no era que no quería es te quiero demasiado eso es lo que pasa la verdad y cuando uno quiere a veces le entra un miedo y si me falto iniciativas, pero al pensar de todo la pasé muy bien.</p>" },
  { text: "<p>Ojalá algún día te vuelva a ver cara a cara y te explique por qué fuiste tan especial para mí. Al día siguiente, la salida con tu familia está entre las tres mejores cosas que me han pasado fue algo muy especial para mí.</p>" },
  { text: "<p>Fue muy lindo conocer a tu familia a tu hermano a tu hermana a tu mama a tu amiga litera fue algo muy lindo para mi y siempre te voy a agradecer por bríndame esa oportunidad de reírme con tu familia.</p>" },
  { text: "<p>Créeme que ese día fue algo muy lindo porque ese día me sentía un poquito mal por tanta cosas que he pensado y está ahí y divertirme y reírme un rato fue algo muy lindo la verdad.</p>" },
  { text: "<p>Lo peor de todo es que mi comportamiento fue muy serio pero es que tenía pena si supieras que a mí también me gustar reír divertirme pasar buen rato pero la pena no me dejaba ni habla.</p>" },
  { text: "<p>Y disculpa mi drama que te genere en el chat voy a hacer honesto todo mi drama no fue por eso fue porque me muero de celos por ti emelis y que culpa sé que acá nadie tiene la culpa porque tú nunca me pediste nada pero dile eso a mi corazón.</p>" },
  { text: "<p>Todo el drama que te arme no fue simplemente drama fue celos y no es que sea celoso solo es que tati tú me encantas muchos y sabes que siempre voy a querer lo mejor para ti pero ese día que llegaste de Cartagena me molesto mucho saber que posiblemente estaba haciendo que cosas.</p>" },
  { text: "<p>Y lo peor me molesta no lo que podría haber hecho sino que me mientas y lo peor de caso sabes que tiene razón en todos no te puedo reclamar nada pero entiende que también me sentí un poquito usado y no te culpo y nunca lo hare porque te entiendo.</p>" },
  { text: "<p>Solo quería que lo supiera me gustar ser muy sincero y directo con la personas por eso mi comportamiento en el chat y no los justifico y no te digo esto para que me hable ni nada solo que me muero de celos por ti sin tener razones alguna y es difícil.</p>" },
  { text: "<p>Ponte en mi puesto por un momento y compradera más que nadie tú mejor que nadie sabes lo que es pasar por lo que yo estoy pasando por ti. Emelis, me moría por tomarte de la mano, tocarte, abrazarte, poner mi mano sobre tu pierna, pero de buena formar, dedicarte más atención.</p>" },
  { text: "<p>Pero sentía mucha pena en ese momento y mas estado por primera vez con tu familia otro punto es que no es que sea frío; es que me gusta hacer las cosas de corazón. Si ese día fallé en demostrarte quién soy, créeme que no soy así.</p>" },
  { text: "<p>Me gusta divertirme y que se note mi presencia no entiendo cuando me dijiste que no te gusta la formar como soy como me expreso no se si referencia a como soy contigo realmente no lo sé si lo dice por el chat me hago la idea que fue por la formar que me expreso por el chat y quiero decirte que realmente yo no soy así.</p>" },
  { text: "<p>Soy muy serio y cálido pero créeme que pensé que te gustaba o si te refiere a como me comporte con tu familia o contigo y si es eso la verdad me molesto bastante porque por naturaleza soy esa persona que le gusta siempre está pendiente de que necesitan de cómo te siente de ayudarte ser una persona caballerosa.</p>" },
  { text: "<p>Y normalmente soy así por naturaleza no porque quiera demostrar esa cualidad. Me dio pena no haber puesto dinero para la comida, pero sabía que no me aceptarías.</p>" },
  { title: "Esperanza y Lecciones", text: "<p>Ese día le comenté a mi familia sobre ti y me apoyaron con el tema por eso también me sentí aún más con el corazón en la mano. Ya me imaginaba pasando la Navidad contigo, pensando en qué regalarte de navidad y de tu cumple.</p>" },
  { text: "<p>Y lo peor es que aún tengo esperanza. Hasta que no salga de tu boca un "no me busques, no me gustas, nunca me gustaste, solo me hacías sentir bien", no me rendiré del todo. Porque te entiendo: estás herida y no estás lista.</p>" },
  { text: "<p>Creo que te comprendí tanto que ya nada me afecta. Solo me duele haber perdido la oportunidad de ayudarte a comprenderte, a sanar, a dejar el pasado. Pero no quisiste. Yo me voy tranquilo, sabiendo que hice todo lo posible.</p>" },
  { text: "<p>Desde la primera vez te dije: "Puedes amarme como a un rompecabezas". Pero nunca supiste cómo armarme. Yo quería ser la persona más completa en tu vida: quería ser tu zona asegurar y también quería ser la parte diversidad de tu vida.</p>" },
  { text: "<p>Te di dos versiones en una sola, y no supiste tomar ninguna. Quizás tenías la mano ocupada con otra cosa. Espero haber sido algo para ti, o al menos útil. Espero que te hayas dado cuenta de que aún hay personas buenas en este mundo.</p>" },
  { text: "<p>No esperes menos de nadie. No dejes que el pasado marque tu futuro. Si algún día quieres volver, aquí estaré. No sé por cuánto tiempo, pero si quieres empezar de cero, con las cosas claras, con objetivos claros, no pierdas tu energía en el pasado.</p>" },
  { text: "<p>El pasado no se puede cambiar. Lo que cambia es lo que haces hoy. Haz las paces con tu historia. No arruines algo bueno por pensar de más. Todos venimos con cicatrices, pero también con ganas de empezar de nuevo.</p>" },
  { text: "<p>Intenta volver a querer, pero elige bien. No te digo que busques algo formal, porque hoy en día es difícil. Solo ten claro qué quieres con la persona. No te enredes en ese bucle amoroso. Perdónate. No debemos cambiar nuestro pasado, aunque duela.</p>" },
  { text: "<p>Pero no te aferres a los malos amores, a los traumas, a las deudas con tu propia persona. Aférrate a ser mejor cada día. Toma lo bueno de cada momento malo. Nunca te voy a odiar, aunque me hayas menospreciado o roto el corazón.</p>" },
  { text: "<p>Siempre te voy a querer porque te llegué a entender. No me rindo contigo, pero dejar ir también es un acto de amor. Tienes que madurar por tu cuenta. Me va a doler no estar ahí, no abrazarte, no consentirte.</p>" },
  { text: "<p>Y sé que puedes volver a caer en el mismo bucle. Pero intenta no vivir en él. La gente es una mierda, pero eso no significa que tú también lo seas. Entiendo que es difícil superar a quien le diste todo: tu vida, tu cuerpo, tus imperfecciones.</p>" },
  { text: "<p>Pero no te conviertas en esa persona que te hizo daño. No se construye un imperio con alguien que sigue mirando al pasado. Suelta y construye tu propio camino. No tengas miedo de empezar de cero.</p>" },
  { text: "<p>Como dice tu música favorita, quizás te guste tu nueva historia. Vive en paz, sin hacer daño a nadie. Enfócate en tus metas. Cuando a alguien le importas, se nota. Y cuando no, también. A mí me cuesta aprenderlo, y tú entiendes eso mejor que nadie.</p>" },
  { text: "<p>Bonito fue compartir un rato. Verte sonreír me alegraba los días malos. Fue mala suerte, o quizás no convenía. Pero valió la pena. Aun así, sigo buscando algo en ti que no sé si encontraré.</p>" },
  { text: "<p>Solo no te conviertas en lo que no eres porque alguien te falló. Reconoce lo que te mereces. Si te mereces que te pongan los cuernos o que te traten mal, pregúntate por qué te gusta eso.</p>" },
  { text: "<p>Reconoce lo que quieres y trata a los demás como merecen. Pero no te vuelvas algo que no eres por miedo a que te fallen otra vez.</p>" },
  { text: "<p>Al final, creo que me va a doler más a mí que a ti, porque tú tienes con qué distraerte. Yo viviré pensando si tomaste mi consejo, si significó algo para ti. Solo te tenía fe. Es feo estar triste por alguien que no lo está por ti y entiendo que tu pasaste por cada esta de la facetas que te menciono.</p>" },
  { text: "<p>Pero entiendo que no debería estarlo. Yo estoy bien, sé lo que quiero. Algunas personas solo llegan a enseñarte algo. Todo es pasajero. Arregla tu desmadre. Y cuando estés libre del pasado y del miedo, trae tu mano desocupada y le damos con todo.</p>" },
  { text: "<p>Yo sabía que la iba a pasar mal, que me mentirías, que quizás todo era falso. Lo sabía, tati. No te sientas mal por eso fue mi decisión yo solo quería volver a traer la mejor versión de ti o mucho mejor sacar una mejor versión de ti.</p>" },
  { text: "<p>Me obsesión con tu historia con tu pasado con tu cuento con la niña que fue feliz en su momento con la niña que vivió miles de aventura con la niña que se caño y se hizo un desmadre y preguntarle si se arrepiente de hacerlo sé que no se igualmente eso pasa en todo los termino tati.</p>" },
  { text: "<p>Aprender que la vida sigue y que no debemos cambiar nuestra vida o pensamiento por culpa de nuestro problema o situaciones o por nuestra heridas del pasado el objetivo esta en ser mejor persona que ayer en sacar la mejor versión de ti. Yo tomé mis decisiones.</p>" },
  { text: "<p>Pero quiero que sepas que no puedes entrar en la vida de alguien que te quiere y luego irte como si nada. No lo digo por rencor, sino porque te entiendo. Solo necesitabas sentir amor incondicional y yo te lo di, sabiéndolo.</p>" },
  { text: "<p>Eres un libro complicado y me tomé el tiempo de leerte. Pero qué lástima que no te gustara que se yo nunca me lo dijiste, pero respeto tu decisión. ¿Qué va a doler? Pues a mí, no. Pero quizás a ti sí. Expresar lo que siento me hace fuerte.</p>" },
  { text: "<p>Pero tú, cuando lleguen los días de lágrimas, ¿Cuánta persona estará ahí para ti? Cuando duelan tus emociones, ¿quién estará? Espero que encuentres a alguien en ese momento un familiar un novio un vacilón que se yo tati por mas fuerte que sea debe dejar el orgullo atrás.</p>" },
  { text: "<p>Siempre necesitamos el apoyo condicional de un amigo una amiga que se yo de alguien no podemos ir contra el mundo solo. No me pongo triste porque soy un buen hombre, no soy interesado.</p>" },
  { text: "<p>Lo único que me molesta es que siempre me dicen es "Eso te pasa por ser buena persona". ¿Desde cuándo ser buena persona es malo? Me gusta ser buena persona para dejar huella. Y espero haber dejado una en tu vida.</p>" },
  { text: "<p>Lamento haber malinterpretado nuestra amistad, pero si me hubieras dicho lo que realmente querías, te lo habría dado. Si querías algo de un momento, te habría dado el mejor momento. Creo que la lección más difícil es aceptar lo que ya no está.</p>" },
  { title: "El último acto de amor", text: "<p>El mayor acto de amor es dejar ir a quien quieres. Y no lo digo por mí, sino por tu pasado. Como último acto de amor, te confieso que siempre me quedaré con las ganas de tener algo contigo o volver a empezar desde cero como dice tu música.</p>" },
  { text: "<p>Y si vivo ilusionado porque nunca me dijiste que me fuera y mi celebro por más razones que me de tu indiferencia conmigo mi corazón dice que aun puedo que no me rinda y cada vez que hablamos cada vez te comprendo y te entiendo más.</p>" },
  { text: "<p>Y si me puedo tomarme el atrevimiento de decir que no tenemos que empezar de cero esa frase creo que gracias a ti se e va a quedar grabada para siempre. Porque yo sí quería que fueras tú y de pronto si me va a doler el típico mensaje lo siento eres mucho para o lo siento no estoy segura ahora.</p>" },
  { text: "<p>Pero más si quiera ese mensaje llegara y si me va doler pero creo que aparte de eso matare por completo mi ilusión y podre dejarte ir por completo.</p>" }
];

const totalPages = pagesData.length;
const wrapper = document.getElementById('bookWrapper');
let htmlBook = "";

for(let i = 0; i < totalPages; i++) {
  const p = pagesData[i];
  const zIndex = totalPages - i;
  
  if(p.isCover) {
    htmlBook += \`
    <div class="book-page page-cover" data-page="\${i}" style="z-index:\${zIndex};">
      <div class="cover-title">\${p.title}</div>
      <div class="cover-subtitle">\${p.subtitle}</div>
    </div>\`;
  } else {
    htmlBook += \`
    <div class="book-page" data-page="\${i}" style="z-index:\${zIndex};">
      <div class="page-content">
        \${p.title ? \`<h3 class="page-title">\${p.title}</h3>\` : ''}
        \${p.text}
      </div>
      <div class="page-number">\${i} / \${totalPages - 1}</div>
    </div>\`;
  }
}
wrapper.innerHTML = htmlBook;

const pageSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');

const pagesNode = document.querySelectorAll('.book-page');
const btnPrev = document.getElementById('btn-prev');
const btnNext = document.getElementById('btn-next');
const pageIndicator = document.getElementById('global-page');
const recuerdosBtn = document.getElementById('recuerdosBtn');

const pages = Array.from(pagesNode); 
let currentPageIndex = 0;

function updateBook() {
  pages.forEach(page => {
    let pgNum = parseInt(page.getAttribute('data-page'));
    if(pgNum < currentPageIndex) {
      page.classList.add('flipped');
    } else {
      page.classList.remove('flipped');
    }
  });

  btnPrev.disabled = (currentPageIndex === 0);
  
  if (currentPageIndex === totalPages - 1) {
    btnNext.disabled = true;
    recuerdosBtn.style.display = 'block';
  } else {
    btnNext.disabled = false;
    recuerdosBtn.style.display = 'none';
  }

  if(currentPageIndex === 0) pageIndicator.textContent = "Portada";
  else pageIndicator.textContent = \`Pág. \${currentPageIndex}\`;
}

function nextPage() {
  if(currentPageIndex < totalPages - 1) {
    currentPageIndex++;
    updateBook();
    try { pageSound.currentTime = 0; pageSound.play(); } catch(e){}
  }
}
function prevPage() {
  if(currentPageIndex > 0) {
    currentPageIndex--;
    updateBook();
    try { pageSound.currentTime = 0; pageSound.play(); } catch(e){}
  }
}
updateBook();

document.getElementById('abrirBtn').onclick = function() {
    let bgm = document.getElementById('bgm');
    bgm.play().catch(e => console.log('Audio error:', e));

    document.getElementById('section-intro').classList.add('hidden-section');
    document.getElementById('section-book').classList.remove('hidden-section');
    document.body.classList.remove('locked');
    window.scrollTo(0, 0);
};

document.getElementById('recuerdosBtn').onclick = function() {
    document.getElementById('section-book').classList.add('hidden-section');
    document.getElementById('section-collage').classList.remove('hidden-section');
    window.scrollTo(0, 0);
};

\n`;

html = html.substring(0, jsReplacementStart) + newJS + html.substring(jsReplacementEnd);

// A little bug check: double quotes inside text. Let's fix them manually since I already used escaped quotes.
// Oh wait, in string templates they are inside ". I used '""', so I should safely unescape in my template literal. 
// BUT wait! I escaped those quotes using \\" inside a literal string, which is fine inside normal strings, but here they are inside backticks in JS. Wait, backticks don't require escaping double quotes! So \\" will evaluate to \\" if inside template literals. No wait, in template literal inside my string, it's fine.

// Actually I can just write it safely using regexes.
fs.writeFileSync('carta-final.html', html, 'utf8');
console.log('Done!');
