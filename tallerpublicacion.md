

# Parte 1. Investigación teórica: publicación de proyectos React + Supabase

## 1\. Cómo llega un usuario a un sitio web

### 1.1. Qué sucede desde que se escribe una URL hasta que aparece la página

Cuando una persona escribe una dirección en el navegador, se inicia una serie de procesos que permiten localizar el servidor, establecer una conexión segura, solicitar los recursos y mostrar el contenido.

El proceso general es el siguiente:

1. **El usuario escribe la URL.** Por ejemplo, `https://github.com/`. El navegador identifica el protocolo y el nombre del servidor al que debe conectarse.
2. **Se realiza la resolución DNS.** El navegador o el sistema operativo consulta si ya conoce la dirección IP del dominio. Si no está en caché, pregunta a un resolver DNS, que busca la respuesta en los servidores correspondientes.
3. **Se obtiene una dirección IP.** El nombre del dominio se traduce a una dirección que permite localizar el servidor. Un dominio puede tener varias direcciones IP y una IP puede alojar varios sitios.
4. **Se establece la conexión de transporte.** En una conexión HTTPS tradicional sobre TCP, el cliente y el servidor realizan el handshake TCP para establecer una comunicación fiable.
5. **Se negocia TLS.** El navegador y el servidor acuerdan parámetros de seguridad y el navegador verifica el certificado presentado por el servidor. Esto permite proteger la comunicación mediante cifrado y comprobar la identidad del sitio.
6. **Se envía la petición HTTP.** El navegador solicita un recurso, por ejemplo, `GET /`. En HTTP/2 y HTTP/3 hay diferencias importantes: HTTP/2 suele utilizar TCP y HTTP/3 utiliza QUIC sobre UDP, por lo que no todos los sitios siguen exactamente la secuencia TCP descrita.
7. **El servidor devuelve una respuesta.** La respuesta contiene un código de estado, cabeceras y, normalmente, el contenido solicitado. Un código `200` indica éxito, mientras que `404` significa que el recurso no se encontró.
8. **El navegador procesa el contenido.** Si recibe HTML, empieza a construir el documento y solicita recursos adicionales como hojas de estilo CSS, archivos JavaScript, imágenes y fuentes.
9. **Se representa la página.** El navegador combina la estructura, los estilos y la ejecución de JavaScript para mostrar la interfaz con la que interactúa el usuario.

En una aplicación React creada con Vite, el navegador suele recibir archivos estáticos compilados. Después ejecuta JavaScript para construir la interfaz y puede comunicarse con Supabase para obtener datos o autenticar usuarios.

### 1.2. Partes de una URL

Ejemplo:

`https://app.ejemplo.com:8443/productos?id=25&orden=precio#detalles`

| Parte | Ejemplo | Función |
| --- | --- | --- |
| Esquema o protocolo | `https` | Indica el protocolo utilizado. |
| Subdominio | `app` | Identifica una sección o servicio del dominio. |
| Dominio registrado | `ejemplo.com` | Nombre registrado por el propietario. |
| TLD | `.com` | Extensión de nivel superior. |
| Puerto | `8443` | Identifica el puerto del servicio. Si se omite, se usa normalmente el predeterminado del protocolo. |
| Ruta | `/productos` | Identifica el recurso solicitado. |
| Query string | `?id=25&orden=precio` | Envía parámetros que la aplicación puede utilizar. |
| Fragmento | `#detalles` | Identifica una sección o destino dentro del documento; normalmente no se envía al servidor en la petición HTTP. |

La URL completa también incluye separadores como `://`, `?`, `&` y `#`. En el ejemplo, el dominio es `ejemplo.com`; `app` es el subdominio y `.com` es el TLD.

### 1.3. Diferencia entre dominio, subdominio y hosting

- **Dominio:** es el nombre legible que se registra para identificar un sitio, como `ejemplo.com`.
- **Subdominio:** es una extensión del dominio que permite separar servicios, como `app.ejemplo.com`, `api.ejemplo.com` o `blog.ejemplo.com`.
- **Hosting o alojamiento:** es el servicio que proporciona recursos para guardar y entregar los archivos del sitio o ejecutar su aplicación.

Estos servicios pueden contratarse por separado porque cumplen funciones distintas. Un registrador administra el registro del nombre; un proveedor DNS administra las reglas que indican a dónde debe dirigirse el dominio; y un hosting entrega la página o ejecuta el backend.

Por ejemplo, puedo registrar `miapp.com` en un registrador, administrar su DNS con Cloudflare y alojar el frontend en Vercel. Los tres servicios pueden estar en proveedores diferentes siempre que sus configuraciones sean compatibles.

---

## 2\. DNS

### 2.1. Qué es DNS y por qué se compara con una agenda de contactos

DNS significa _Domain Name System_ o sistema de nombres de dominio. Es un sistema distribuido que permite encontrar información asociada a nombres como `github.com`, incluidas las direcciones IP necesarias para conectarse a un servicio.

Se compara con una agenda de contactos porque una persona recuerda un nombre, mientras que el sistema utiliza datos técnicos para localizar el destino. En lugar de recordar una dirección IP, el usuario escribe un dominio fácil de reconocer.

DNS no almacena necesariamente el sitio web completo ni siempre devuelve una única IP: también puede proporcionar información sobre servidores de correo, delegaciones, verificaciones y otros servicios.

### 2.2. Jerarquía DNS

La resolución DNS se apoya en varios niveles:

1. **Root servers o servidores raíz:** indican qué servidores conocen cada extensión de nivel superior.
2. **TLD servers:** gestionan información de extensiones como `.com`, `.org` o `.co` y señalan los servidores autoritativos del dominio.
3. **Servidores autoritativos:** contienen los registros DNS publicados para una zona, por ejemplo, los registros A, MX o TXT de un dominio.
4. **Resolver recursivo:** recibe la consulta del usuario, busca en su caché y, si hace falta, consulta a los servidores necesarios hasta obtener una respuesta.

Los servidores raíz no tienen guardadas las direcciones de todos los sitios. Su función es orientar la consulta hacia el siguiente nivel. Además, en la práctica existen cachés, servidores intermedios y mecanismos de optimización que reducen las consultas repetidas.

### 2.3. Tipos de registros DNS

| Registro | Para qué sirve | Ejemplo de valor |
| --- | --- | --- |
| **A** | Relaciona un nombre con una dirección IPv4. | `192.0.2.10` |
| **AAAA** | Relaciona un nombre con una dirección IPv6. | `2001:db8::10` |
| **CNAME** | Hace que un nombre sea un alias de otro nombre DNS. | `hosting.ejemplo.net` |
| **ALIAS / ANAME** | Permite apuntar el dominio raíz a un nombre de destino y resolverlo a direcciones IP mediante funciones del proveedor. | `mi-sitio.hosting.example` |
| **MX** | Identifica los servidores que reciben correo para el dominio; incluye una prioridad. | `10 mail.ejemplo.com` |
| **TXT** | Almacena texto para verificaciones y políticas, entre otros usos. | `v=spf1 include:proveedor.example -all` |
| **NS** | Identifica los servidores autoritativos de una zona DNS. | `ns1.proveedor.example` |
| **SOA** | Contiene información administrativa de la zona, como el servidor principal, contacto, número de serie y temporizadores. | `ns1.ejemplo.com. hostmaster.ejemplo.com. 2026101401 ...` |

Las direcciones `192.0.2.10` y `2001:db8::10` son ejemplos reservados para documentación, no destinos reales que deban utilizarse para publicar una aplicación.

#### A y AAAA

El registro A se utiliza cuando el destino tiene una dirección IPv4. El registro AAAA se utiliza para IPv6. Un sitio puede publicar ambos para aceptar conexiones a través de las dos versiones del protocolo IP.

#### CNAME

Un CNAME indica que un nombre es un alias de otro nombre, en vez de almacenar directamente una dirección IP. Por ejemplo, `www.ejemplo.com` puede apuntar a `miapp.hosting.example`.

En el DNS tradicional, un nombre que contiene un CNAME no puede combinarse libremente con otros registros de datos en ese mismo nombre. Por esta razón, no suele utilizarse un CNAME estándar en el vértice de la zona, como `ejemplo.com`, donde también deben existir registros propios de la zona.

#### ALIAS y ANAME

Son mecanismos que ofrecen algunos proveedores para resolver ese problema. Permiten configurar un destino basado en otro nombre en el dominio raíz y el proveedor obtiene las direcciones necesarias.

No son tipos de registro DNS estándar equivalentes al CNAME: su funcionamiento depende del proveedor y de cómo publique las respuestas.

#### MX

Los registros MX permiten recibir correo electrónico. Por ejemplo, una empresa puede indicar que los mensajes de `usuario@ejemplo.com` se entreguen a su proveedor de correo. El número de prioridad permite ordenar los servidores: normalmente se intenta primero el que tiene el valor más bajo.

#### TXT: SPF, DKIM y verificación

Los registros TXT tienen varios usos importantes:

- **SPF:** publica una política sobre qué servidores pueden enviar correo en nombre de un dominio. Ejemplo ilustrativo: `v=spf1 include:_spf.proveedor.example -all`.
- **DKIM:** publica una clave pública que permite verificar firmas criptográficas incluidas en los correos. Ejemplo ilustrativo: `v=DKIM1; k=rsa; p=CLAVE_PUBLICA`.
- **Verificación de dominio:** un proveedor puede solicitar un texto único para comprobar que el usuario controla el dominio. Ejemplo: `proveedor-verification=TOKEN_EJEMPLO`.

Los valores anteriores son ejemplos de formato; no deben copiarse como si fueran credenciales válidas para un dominio real. La configuración de SPF y DKIM debe coincidir con el proveedor de correo que realmente se utilice.

#### NS y SOA

Los registros NS identifican los servidores autoritativos que responden por una zona. El registro SOA contiene datos administrativos que ayudan a controlar la versión de la zona y la coordinación entre servidores DNS.

### 2.4. TTL, caché y propagación DNS

TTL significa _Time To Live_ y establece cuánto tiempo puede conservarse una respuesta DNS en caché, normalmente expresado en segundos.

Por ejemplo, si un registro tiene un TTL de 3.600 segundos, una caché que acaba de recibirlo puede conservar esa respuesta durante aproximadamente una hora antes de volver a consultar por ella.

La llamada **propagación DNS** describe el periodo durante el cual distintos resolvers dejan de utilizar información anterior y comienzan a responder con la nueva configuración. No significa que exista un único proceso global que envíe el cambio a todos los dispositivos.

El tiempo depende de factores como:

- El TTL anterior, que puede seguir vigente en cachés existentes.
- Las cachés de los resolvers, sistemas operativos y navegadores.
- La actualización y sincronización de los servidores autoritativos.
- Los registros NS y DNSSEC, cuando corresponda.
- Las cachés negativas que guardan respuestas sobre nombres o registros inexistentes.

Un cambio puede observarse en minutos si las cachés ya vencieron, pero en determinadas situaciones puede tardar más. No es correcto garantizar que todos los cambios se completan siempre en 24 o 48 horas. Reducir el TTL con anticipación puede ayudar, aunque un TTL nuevo no elimina inmediatamente las respuestas almacenadas con el TTL anterior.

### 2.5. Ejercicio práctico de DNS

Para comprobar la resolución de dominios se pueden utilizar herramientas como `nslookup` y `dig`. Estos comandos deben ejecutarse en la terminal del equipo.

```
nslookup github.io
dig github.com A
dig github.com MX
dig +trace anthropic.com
```

Qué aporta cada comando:

- `nslookup github.io`: consulta la resolución del nombre y muestra el servidor DNS utilizado y la respuesta recibida.
- `dig github.com A`: consulta los registros IPv4 de `github.com`.
- `dig github.com MX`: consulta los servidores de correo configurados para el dominio.
- `dig +trace anthropic.com`: intenta mostrar la resolución siguiendo las delegaciones desde los servidores raíz hasta los servidores autoritativos.

La salida depende del momento, del resolver y de la red desde la que se ejecute. En el documento definitivo se debe pegar la salida real de cada comando y añadir una breve interpretación. Si no se dispone de `dig`, en Windows puede utilizarse `nslookup -type=MX github.com` para consultar los MX.

Escritura

---

## 3\. Dominios

### 3.1. Registrador, proveedor DNS y hosting

Un **registrador de dominios** (_registrar_) es una empresa autorizada para registrar nombres de dominio y gestionar su renovación ante el registro correspondiente. Algunos ejemplos son Namecheap y Porkbun.

Un **proveedor DNS** administra los registros que indican qué servicios están asociados a un dominio. Puede encargarse de las direcciones del sitio, del correo electrónico y de las verificaciones de propiedad.

Un **proveedor de hosting** ofrece infraestructura para publicar archivos, ejecutar aplicaciones, almacenar datos o procesar solicitudes.

Estas funciones pueden pertenecer a una misma empresa, pero no son lo mismo. Por ejemplo, se puede registrar un dominio en Namecheap, utilizar Cloudflare para DNS y publicar el frontend en GitHub Pages.

### 3.2. TLD genéricos y TLD de código de país

Un TLD (_Top-Level Domain_) es la extensión que aparece al final de un dominio.

- **`.com`****:** extensión genérica ampliamente utilizada por empresas, proyectos y particulares.
- **`.dev`****:** extensión genérica asociada con proyectos de desarrollo. Requiere HTTPS por las políticas de seguridad de los navegadores que aplican la lista HSTS correspondiente.
- **`.app`****:** extensión genérica que también requiere HTTPS en navegadores compatibles por su inclusión en la lista HSTS.
- **`.co`****:** originalmente es el dominio de código de país de Colombia, aunque se comercializa internacionalmente y puede registrarse desde otros países.
- **`.com.co`****:** dominio de segundo nivel bajo `.co`, utilizado frecuentemente por empresas y organizaciones comerciales colombianas.

Los TLD genéricos pueden tener reglas propias. Por ejemplo, `.app` y `.dev` exigen prestar especial atención a HTTPS. Los dominios de código de país pueden tener requisitos de residencia, documentación o elegibilidad, según la extensión. En el caso de `.co`, su comercialización internacional permite el registro por personas y empresas de otros países.

Antes de comprar un dominio, se deben revisar las condiciones de la extensión concreta y las reglas del registrador.

### 3.3. WHOIS y privacidad del dominio

WHOIS es un servicio utilizado para consultar información de registro de dominios y otros recursos de Internet. Dependiendo de la extensión y del registrador, puede mostrar datos como el registrador, las fechas de registro y vencimiento, los nameservers y parte de la información de contacto.

La privacidad de dominio permite ocultar o sustituir ciertos datos personales en los resultados públicos. No significa que el registrador deje de conocer la identidad del titular ni que toda la información se vuelva inaccesible para las autoridades o los procesos legales correspondientes.

Los datos visibles varían por las políticas de privacidad, las reglas del registro y la normativa aplicable. También existen servicios de consulta basados en RDAP, que complementan o sustituyen los sistemas WHOIS tradicionales en determinados contextos.

### 3.4. Nameservers y cambio de proveedor

Los nameservers son los servidores que contienen la información DNS autoritativa de un dominio.

Cuando se dice que se va a «apuntar un dominio a otro proveedor», es necesario distinguir dos operaciones:

- **Cambiar los nameservers:** delega la administración de la zona DNS a otro proveedor.
- **Cambiar registros DNS:** mantiene el proveedor DNS actual, pero modifica registros como A, AAAA, CNAME o MX para dirigir el tráfico a otro servicio.

Antes de cambiar los nameservers, es recomendable copiar todos los registros existentes, incluidos los MX y TXT del correo. Si se omiten registros importantes, el sitio puede funcionar mientras el correo deja de recibir mensajes o se pierden verificaciones.

### 3.5. Precios de dominios .com y .co

Los precios varían según el registrador, las promociones, los impuestos y la moneda. La siguiente tabla recoge precios publicados en páginas oficiales consultadas el 14 de octubre de 2026. Los valores están en dólares estadounidenses y pueden cambiar.

| Registrador | Extensión | Precio inicial publicado | Renovación publicada |
| --- | --- | --- | --- |
| Namecheap | `.com` | Desde US$6,79 para nuevos clientes elegibles; también aparece una tarifa promocional de US$11,28 | US$18,48/año |
| Porkbun | `.com` | Desde US$11,08 | Confirmar tarifa aplicable en el carrito o tabla vigente |
| Namecheap | `.co` | US$7,98 promocional | US$45,48/año |
| Porkbun | `.co` | US$15,76 promocional | US$31,20/año |

Fuentes de precios: [Namecheap, precios de dominios](<https://www.namecheap.com/domains/>), [Namecheap, extensión .co](<https://www.namecheap.com/domains/registration/cctld/co/>), [Porkbun, precios de dominios](<https://porkbun.com/products/domains>) y [Porkbun, extensión .co](<https://porkbun.com/tld/co/>).

Estos valores permiten ver que una promoción inicial no siempre es la opción más económica a largo plazo. Para realizar una comparación justa, hay que verificar la tarifa de renovación, los impuestos y cualquier cargo adicional antes de completar la compra.

El precio de renovación suele ser diferente al del primer año porque el registrador puede ofrecer descuentos de captación durante el registro inicial. La renovación puede aplicar la tarifa regular del servicio y los costes establecidos por el registro de la extensión. También pueden influir las promociones para nuevos clientes y las variaciones de precios mayoristas.

---

## 4\. HTTPS y certificados

### 4.1. Qué es TLS/SSL y qué protege

TLS (_Transport Layer Security_) es el protocolo que protege la comunicación entre un cliente y un servidor. SSL es el nombre de una familia de protocolos anterior que hoy se considera obsoleta; en la práctica, la expresión «certificado SSL» suele referirse a un certificado utilizado con TLS.

TLS proporciona tres propiedades importantes:

- **Confidencialidad:** cifra los datos transmitidos para dificultar que terceros los lean.
- **Integridad:** ayuda a detectar modificaciones no autorizadas durante la transmisión.
- **Autenticación del servidor:** permite verificar que el servidor presenta un certificado válido para el nombre de dominio solicitado.

Por ejemplo, cuando una persona inicia sesión en una aplicación, HTTPS protege las credenciales durante el trayecto entre su navegador y el servidor. No garantiza por sí solo que la aplicación sea legítima, que el servidor no esté comprometido ni que los datos almacenados estén protegidos correctamente.

### 4.2. Autoridad Certificadora y Let's Encrypt

Una Autoridad Certificadora (CA) es una entidad que emite certificados digitales conforme a determinados procedimientos de validación.

Let's Encrypt es una CA que ofrece certificados TLS sin coste y automatiza su emisión y renovación mediante protocolos como ACME. Esto facilita que sitios personales, proyectos académicos y aplicaciones comerciales utilicen HTTPS.

Para emitir un certificado, el solicitante debe demostrar control sobre el dominio mediante un método de validación admitido. El certificado se instala o se configura automáticamente en el servicio de alojamiento, según la plataforma.

### 4.3. Diferencias entre DV, OV y EV

| Tipo | Qué valida | Uso habitual |
| --- | --- | --- |
| DV (_Domain Validation_) | El control del nombre de dominio. | Blogs, aplicaciones web y la mayoría de los proyectos. |
| OV (_Organization Validation_) | El control del dominio y determinados datos de la organización. | Sitios empresariales que requieren validación organizativa. |
| EV (_Extended Validation_) | Verificaciones adicionales de identidad de la entidad según las reglas de EV. | Organizaciones con requisitos específicos de validación. |

Los tres tipos pueden utilizar TLS para cifrar las conexiones. La diferencia principal está en la validación de la identidad, no en que un certificado EV cifre automáticamente mejor que uno DV.

### 4.4. Certificado wildcard

Un certificado wildcard permite cubrir varios subdominios que coinciden con un patrón. Por ejemplo, `*.ejemplo.com` puede cubrir `app.ejemplo.com` y `api.ejemplo.com`.

Normalmente, no cubre el dominio raíz `ejemplo.com` por sí solo, ni cubre automáticamente subdominios de varios niveles como `v1.api.ejemplo.com`. Es importante revisar los nombres incluidos en el certificado.

### 4.5. Error «certificado no válido para este nombre»

Este error aparece cuando el nombre utilizado en la URL no coincide con los nombres cubiertos por el certificado, o cuando existe otro problema de validación del certificado.

Puede ocurrir al configurar un dominio personalizado si:

- El DNS ya apunta al hosting, pero todavía no se ha emitido el certificado.
- Se solicita un dominio distinto del que cubre el certificado.
- El hosting no reconoce el dominio personalizado o no ha terminado su configuración.
- El certificado está vencido o la cadena de confianza no se valida correctamente.

Por ejemplo, si el certificado cubre `www.ejemplo.com` pero el usuario visita `ejemplo.com`, puede aparecer un error si el nombre raíz no está incluido.

La solución consiste en comprobar los registros DNS, añadir el dominio correcto en la plataforma y verificar que el certificado emitido incluya todos los nombres necesarios. No se debe ignorar la advertencia de seguridad para una aplicación en producción.

### 4.6. Qué es HSTS

HSTS significa _HTTP Strict Transport Security_. Es una política que un sitio comunica al navegador mediante una cabecera HTTP para indicar que debe utilizar HTTPS durante el periodo establecido.

Por ejemplo:

```
Strict-Transport-Security: max-age=31536000
```

Esta cabecera solicita que el navegador recuerde durante un año la política HTTPS para el host correspondiente. La directiva `includeSubDomains` puede extenderla a subdominios y debe utilizarse con cuidado, porque exige que todos los subdominios cubiertos funcionen correctamente con HTTPS.

HSTS reduce la posibilidad de que un navegador vuelva a HTTP inseguro, pero no sustituye a un certificado válido ni soluciona una configuración incorrecta del servidor.

Escritura

---

## 5\. Modelos de alojamiento

### 5.1. Modelos, ventajas, desventajas y casos de uso

| Modelo | Ejemplos | Ventajas | Desventajas | ¿Cuándo usarlo? |
| --- | --- | --- | --- | --- |
| Hosting compartido | Hostinger, cPanel | Económico, fácil de administrar y suele incluir herramientas de gestión. | Recursos compartidos, menos control del sistema y restricciones para ejecutar aplicaciones específicas. | Sitios informativos, blogs y páginas empresariales sencillas. |
| VPS | DigitalOcean Droplet, Linode, AWS EC2 | Control sobre el sistema, posibilidad de instalar software y configurar servicios. | Hay que administrar actualizaciones, seguridad, despliegues y monitorización. | Aplicaciones con backend propio que requieren control del servidor. |
| Servidor dedicado | OVH, Hetzner | Recursos físicos reservados y mayor control del hardware. | Coste superior y mayor responsabilidad administrativa. | Sistemas con necesidades altas de rendimiento, aislamiento o capacidad. |
| PaaS | Render, Railway, Heroku, Fly.io | Simplifica el despliegue, integra repositorios y reduce tareas de administración. | Límites por plan, costes de escalado y menor control sobre la infraestructura subyacente. | APIs, aplicaciones web y backends que se desean publicar rápidamente. |
| Serverless / Functions | Vercel Functions, AWS Lambda, Supabase Edge Functions | Escalado gestionado y ejecución bajo demanda, según el servicio. | Límites de duración, cuotas, latencia de arranque en algunos servicios y complejidad para tareas largas. | Webhooks, operaciones breves, validaciones y endpoints específicos. |
| Hosting estático + CDN | GitHub Pages, Netlify, Cloudflare Pages, Vercel | Publicación rápida, distribución global y poco mantenimiento del servidor. | No ejecuta por sí solo un backend tradicional y puede necesitar reglas especiales para rutas SPA. | Frontends React compilados, documentación, portafolios y sitios informativos. |
| BaaS | Supabase, Firebase, Appwrite | Ofrece servicios administrados de base de datos, autenticación y otros componentes. | Dependencia del proveedor, cuotas, costes de crecimiento y necesidad de configurar correctamente los permisos. | Aplicaciones que requieren datos y autenticación sin construir toda la infraestructura desde cero. |

Los modelos pueden combinarse. Por ejemplo, una aplicación puede publicar su frontend React en un hosting estático, utilizar Supabase como BaaS y ejecutar operaciones privadas en funciones serverless.

### 5.2. Qué es un CDN

Un CDN (_Content Delivery Network_) es una red de servidores distribuidos geográficamente que entrega contenido desde ubicaciones cercanas a los usuarios.

Resuelve tres problemas principales:

- **Latencia:** reduce la distancia de red entre el usuario y el contenido.
- **Carga del origen:** disminuye la cantidad de solicitudes que llegan directamente al servidor original.
- **Caché:** conserva temporalmente copias de recursos que se solicitan con frecuencia.

Por ejemplo, una imagen estática de una aplicación puede almacenarse en caché en un punto de presencia cercano al usuario. Si la política de caché permite reutilizarla, no será necesario solicitarla de nuevo al origen en cada visita.

Un CDN no hace que cualquier consulta a una base de datos sea automáticamente más rápida. El contenido dinámico y las operaciones que requieren datos actualizados necesitan estrategias específicas.

### 5.3. Sitio estático frente a sitio dinámico

Un sitio estático entrega archivos previamente generados, como HTML, CSS, JavaScript e imágenes. El servidor no necesita ejecutar código de la aplicación para generar cada página solicitada.

Un sitio dinámico genera contenido durante la petición o consulta servicios para responder con información que cambia según el usuario, la sesión o los datos disponibles.

La distinción no significa que una web estática no pueda mostrar información actualizada. Un frontend estático puede ejecutar JavaScript en el navegador y consultar una API o una base de datos remota. En ese caso, la interfaz se distribuye como archivos estáticos, aunque la aplicación completa utiliza servicios dinámicos.

### 5.4. Por qué React con Vite o CRA se convierte en un sitio estático

Durante el desarrollo, herramientas como Vite ejecutan un servidor que facilita la recarga y la depuración. Al ejecutar el comando de producción, el código de la aplicación se transforma en archivos que el navegador puede utilizar directamente.

En Vite, el comando habitual es:

```
npm run build
```

Si el script está configurado de forma predeterminada, Vite genera una carpeta `dist/` con los archivos compilados. Create React App utiliza habitualmente una carpeta `build/`.

Esos archivos pueden publicarse en un hosting estático porque el servidor solo necesita entregarlos. Si la aplicación consulta Supabase, las peticiones a la base de datos se realizan desde el navegador hacia los servicios de Supabase; no es necesario que el hosting estático ejecute un servidor Node.js propio para servir el frontend.

### 5.5. Qué es una SPA y por qué puede aparecer un 404

Una SPA (_Single Page Application_) es una aplicación que carga una estructura principal y utiliza JavaScript para cambiar la vista sin solicitar un documento HTML independiente para cada navegación.

Por ejemplo, React Router puede mostrar la sección de inicio en `/` y el panel del usuario en `/dashboard`.

El problema aparece cuando el usuario recarga directamente `/dashboard`. El navegador envía una petición a esa ruta y un hosting estático puede intentar encontrar un archivo o directorio físico llamado `dashboard`. Si no existe, devuelve un `404`, aunque React sepa representar esa vista.

La solución es configurar una regla de fallback que entregue `index.html` para las rutas de la SPA que no correspondan a archivos reales. Después, el router del frontend interpreta la URL.

No todas las plataformas tienen la misma configuración predeterminada. GitHub Pages suele necesitar una estrategia adicional para ciertas rutas; otras plataformas ofrecen reglas de reescritura o fallback según su configuración.

---

## 6\. Comparativa de plataformas de despliegue

Los límites de los planes gratuitos pueden cambiar con el tiempo y dependen del tipo de proyecto, de la cuenta y del uso. Esta tabla resume características generales de los planes gratuitos y debe verificarse antes de elegir una plataforma.

| Característica | GitHub Pages | Netlify | Vercel | Cloudflare Pages | Render |
| --- | --- | --- | --- | --- | --- |
| Ancho de banda gratuito | Límite orientativo de 100 GB/mes; es un límite flexible publicado por GitHub. | Sistema de créditos: el plan Free incluye 300 créditos/mes compartidos entre varios recursos. | Cuotas de transferencia según las condiciones vigentes del plan Hobby. | Las solicitudes de archivos estáticos son gratuitas e ilimitadas según la documentación de Pages. | El uso de sitios estáticos consume la cuota mensual de ancho de banda del workspace; revisar el panel del plan. |
| Builds | Límite orientativo de 10 builds/hora para el mecanismo estándar; los workflows personalizados de Actions tienen condiciones distintas. | Consumen créditos del plan gratuito. | Límite documentado de duración de build de 45 minutos por despliegue en Hobby; también existen límites de uso. | 500 builds/mes en Free según la tabla de límites publicada para Pages. | Los minutos de pipeline consumen la cuota mensual incluida. |
| Tamaño | Sitio publicado de hasta 1 GB. | Depende del plan, los recursos y las restricciones vigentes. | Límite de 100 MB por archivo estático según los límites publicados para Hobby; verificar las reglas del producto concreto. | Hasta 20.000 archivos en Free y 25 MiB por archivo estático. | Revisar los límites vigentes del servicio estático y el uso del workspace. |
| Variables de entorno en el build | Sí, si se construye con GitHub Actions y se configuran variables o secretos. | Sí. | Sí. | Sí. | Sí. |
| Rutas SPA sin configuración extra | No debe asumirse; algunas rutas requieren fallback o una estrategia adicional. | Sí, normalmente puede configurarse mediante redirecciones o reglas de reescritura. | Sí, en configuraciones compatibles con el framework y las reglas de enrutamiento. | Habitualmente sí para una SPA estática sin un `404.html` propio, sujeto a la configuración del proyecto. | No debe asumirse; puede requerir reglas de reescritura. |
| Backend / funciones serverless | No ofrece backend serverless propio integrado en Pages; Actions sirve para automatización y CI/CD. | Sí, mediante Netlify Functions y otros servicios compatibles. | Sí, mediante funciones y otras capacidades del servicio. | Sí, mediante Pages Functions y Cloudflare Workers, con cuotas aplicables. | Sí, mediante servicios web y otros productos de la plataforma; no equivale al modelo de funciones de Vercel. |
| Dominio personalizado y HTTPS | Sí, con HTTPS disponible cuando el dominio está configurado correctamente. | Sí, con certificados SSL/TLS administrados. | Sí, con HTTPS automático en dominios configurados correctamente. | Sí, con HTTPS para dominios configurados. | Sí, con dominios personalizados y certificados TLS administrados. |
| Preview deployments por Pull Request | No es una función estándar de Pages comparable a las previews por PR de otras plataformas; puede montarse un workflow propio. | Sí. | Sí. | Sí, con deployments de preview para ramas y solicitudes de cambio. | Ofrece previews para servicios y configuraciones compatibles; verificar el tipo de servicio y plan. |

Fuentes oficiales para comprobar los límites:

- GitHub Pages: límites de uso
- [Netlify: planes y precios](<https://www.netlify.com/pricing/>)
- [Vercel: plan Hobby](<https://vercel.com/docs/plans/hobby>) y [límites](<https://vercel.com/docs/limits>)
- Cloudflare Pages: límites
- [Render: sitios estáticos](<https://render.com/docs/static-sites>) y [plan gratuito](<https://render.com/docs/free>)

**Nota sobre la comparación:** las plataformas cambian sus sistemas de facturación y sus límites. En particular, Netlify utiliza un modelo de créditos que agrupa distintos consumos, por lo que no conviene convertir automáticamente esos créditos en una cantidad fija de GB o minutos de compilación. Para un informe entregado en una fecha determinada, se debe registrar la fecha de consulta y verificar cada cuota en la documentación oficial.

### ¿Qué plataforma elegiría para mi proyecto?

Para una aplicación académica desarrollada con React, Vite y Supabase, elegiría GitHub Pages si el objetivo principal es aprender a publicar una SPA estática y practicar GitHub Actions. Permite alojar gratuitamente el frontend y mantener el código y el despliegue en el mismo repositorio. Supabase puede encargarse de la base de datos, la autenticación y otros servicios remotos. Sin embargo, si necesitara previews automáticas por Pull Request, un backend integrado o una configuración más sencilla para las rutas, consideraría Netlify, Vercel o Cloudflare Pages. La decisión final depende de las cuotas vigentes, las necesidades de la aplicación y el trabajo de configuración que se esté dispuesto a asumir.

Escritura

---

## 7\. Supabase en producción

### 7.1. Qué es un BaaS y qué ofrece Supabase

BaaS significa _Backend as a Service_ o backend como servicio. Es un modelo en el que un proveedor ofrece componentes de backend administrados para que los desarrolladores no tengan que construir y mantener toda la infraestructura desde cero.

Supabase es una plataforma que utiliza PostgreSQL y ofrece diferentes servicios para desarrollar aplicaciones:

- **Postgres:** base de datos relacional donde se almacenan registros y se ejecutan consultas SQL.
- **Auth:** autenticación y administración de sesiones de usuarios, con opciones como correo electrónico y proveedores externos.
- **Storage:** almacenamiento de archivos, imágenes y otros objetos.
- **Realtime:** mecanismos para recibir actualizaciones y eventos en tiempo real.
- **Edge Functions:** funciones que ejecutan código en infraestructura administrada, útiles para operaciones que no deben realizarse directamente desde el navegador.

Por ejemplo, en una aplicación React para administrar tareas, Postgres puede almacenar las tareas, Auth identifica al usuario, Storage conserva los archivos adjuntos y Realtime permite reflejar determinados cambios sin recargar toda la página.

### 7.2. Diferencia entre anon key y service\_role key

Las claves de Supabase permiten identificar y autorizar el acceso a sus APIs, pero no todas tienen el mismo nivel de privilegios.

| Clave | Uso | ¿Puede ir en el frontend? |
| --- | --- | --- |
| `anon` o clave publicable | Identifica las solicitudes realizadas por la aplicación cliente. Los permisos efectivos dependen del rol y de las políticas de acceso. | Sí, si las tablas, los permisos y las políticas están configurados correctamente. |
| `service_role` o clave secreta administrativa | Permite operaciones privilegiadas y puede omitir las políticas RLS. | **Nunca.** Debe permanecer en un entorno seguro del servidor. |

Supabase está incorporando formatos nuevos de claves, como las claves publicables (`sb_publishable_...`) y las claves secretas (`sb_secret_...`). En proyectos antiguos todavía pueden encontrarse `anon` y `service_role`.

La regla fundamental es que una clave publicable puede estar disponible en el cliente porque no sustituye a la autorización de cada operación. Una clave secreta otorga privilegios elevados y no debe incluirse en el código descargado por el navegador, en un repositorio público ni en una variable `VITE_`.

### 7.3. Qué es RLS y por qué es indispensable

RLS significa _Row Level Security_ o seguridad a nivel de fila. Es una función de PostgreSQL que permite decidir qué filas puede consultar o modificar un usuario, según las reglas definidas en la base de datos.

Activar RLS es esencial cuando se expone una tabla mediante la API de Supabase. Si una tabla permite acceso a un rol y no tiene políticas adecuadas, las solicitudes de ese rol podrían acceder a filas que no deberían estar disponibles.

La clave pública no es una barrera de seguridad suficiente. Cualquier usuario puede inspeccionar el código del frontend y reutilizar las solicitudes que realiza la aplicación. La protección de los datos debe implementarse en la base de datos, mediante RLS y permisos SQL apropiados.

### 7.4. Ejemplo de política RLS para leer y editar las propias filas

Supongamos que existe una tabla `tareas` con las columnas `id`, `user_id` y `titulo`. La columna `user_id` almacena el identificador del propietario, correspondiente al usuario autenticado.

El siguiente ejemplo activa RLS y crea políticas para que cada usuario pueda consultar, insertar y actualizar únicamente sus propias tareas.

```
alter table public.tareas
enable row level security;

create policy "Leer tareas propias"
on public.tareas
for select
to authenticated
using (
  (select auth.uid()) = user_id
);

create policy "Crear tareas propias"
on public.tareas
for insert
to authenticated
with check (
  (select auth.uid()) = user_id
);

create policy "Editar tareas propias"
on public.tareas
for update
to authenticated
using (
  (select auth.uid()) = user_id
)
with check (
  (select auth.uid()) = user_id
);
```

Explicación:

- `auth.uid()` devuelve el identificador del usuario autenticado en la solicitud.
- `USING` determina qué filas existentes puede ver o modificar el usuario.
- `WITH CHECK` valida que una fila nueva o modificada cumpla la política.
- `TO authenticated` restringe estas políticas al rol de usuarios autenticados.

La política de actualización utiliza ambas comprobaciones: así el usuario no puede actualizar una fila ajena ni cambiar el propietario de su propia fila para transferirla a otra cuenta.

Estas políticas no conceden por sí solas todos los privilegios SQL necesarios. También deben revisarse los `GRANT` de la tabla y los permisos de las columnas. Si la aplicación no necesita borrar tareas, no debe concederse acceso de borrado innecesariamente.

### 7.5. CORS, Site URL y Redirect URLs

**CORS** (_Cross-Origin Resource Sharing_) es un mecanismo del navegador que controla si una página puede realizar determinadas solicitudes a un servidor de otro origen. El origen se define por el esquema, el host y el puerto.

Por ejemplo, el frontend puede estar publicado en:

`https://usuario.github.io`

y realizar solicitudes al proyecto de Supabase desde ese origen.

En los servicios que requieren una lista explícita de orígenes permitidos, se debe autorizar el dominio correcto. Sin embargo, no se debe asumir que todos los servicios de Supabase requieren una lista CORS idéntica ni que CORS sustituye a la autorización de la base de datos. Los fallos de CORS deben investigarse según el endpoint y el servicio concreto.

En Supabase Auth existen dos configuraciones importantes:

- **Site URL:** establece la URL principal utilizada como destino predeterminado en determinados flujos de autenticación.
- **Redirect URLs:** contiene los destinos permitidos a los que Auth puede redirigir después de procesos como el inicio de sesión o la confirmación por correo.

En producción, Site URL debe dejar de apuntar únicamente a `localhost`. También deben añadirse las URLs reales de producción y, si corresponde, las de desarrollo y las de previsualización.

Si estas direcciones están mal configuradas, un usuario puede autenticarse y terminar redirigido a una dirección equivocada, recibir un error de URL no permitida o no completar correctamente la confirmación por correo o la recuperación de contraseña.

Para una aplicación en GitHub Pages, hay que prestar atención a la ruta del repositorio. Por ejemplo, la URL real puede ser `https://usuario.github.io/mi-proyecto/`, no solamente `https://usuario.github.io/`.

### 7.6. Límites del plan gratuito de Supabase

El plan gratuito es útil para proyectos académicos y prototipos, pero tiene cuotas de recursos. Según la documentación oficial consultada, incluye los siguientes límites principales:

| Recurso | Cuota del plan gratuito |
| --- | --- |
| Proyectos gratuitos | Hasta 2 proyectos activos según las condiciones del plan |
| Tamaño de base de datos | 500 MB por proyecto |
| Almacenamiento de archivos | 1 GB |
| Transferencia de datos (_egress_) | 5 GB |
| Usuarios activos mensuales de Auth | 50.000 |
| Invocaciones de Edge Functions | 500.000 |
| Mensajes Realtime | 2 millones |
| Conexiones Realtime simultáneas máximas | 200 |

Estos límites pueden cambiar, y otros recursos tienen cuotas adicionales o restricciones particulares. Debe revisarse la página oficial de precios antes de desplegar una aplicación con tráfico real.

Otra limitación importante es que Supabase puede pausar automáticamente los proyectos del plan gratuito que presentan una actividad insuficiente durante un periodo de aproximadamente siete días. Un proyecto pausado puede necesitar reanudarse desde el panel de administración. No debe asumirse que un proyecto académico gratuito estará disponible indefinidamente sin mantenimiento.

Para una aplicación de producción con usuarios reales, conviene evaluar la disponibilidad, las copias de seguridad, la recuperación ante fallos y los límites de uso antes de elegir el plan.

Fuente: [Supabase: precios y cuotas](<https://supabase.com/docs/guides/platform/billing-on-supabase>) y [Supabase: pausa de proyectos gratuitos](<https://supabase.com/docs/guides/platform/free-project-pausing>).

---

## 8\. Variables de entorno y seguridad

### 8.1. Qué es una variable de entorno

Una variable de entorno es un valor de configuración que un programa puede leer durante su ejecución o durante un proceso de compilación.

Sirve para separar la configuración del código. Por ejemplo, una aplicación puede necesitar una URL de API distinta en desarrollo y en producción.

En proyectos JavaScript es frecuente utilizar archivos como `.env`, `.env.development` o `.env.production`, aunque el modo exacto en que se leen depende de la herramienta.

### 8.2. Por qué `.env` debe estar en `.gitignore`

El archivo `.env` puede contener direcciones internas, credenciales, tokens y otros datos que no deberían publicarse en el repositorio.

Por esa razón, se suele incluir en `.gitignore`:

```
.env
.env.*
!.env.example
```

El archivo `.env.example` sirve para documentar qué variables necesita el proyecto sin incluir valores secretos reales. Por ejemplo:

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

El nombre de las variables debe coincidir con el código de la aplicación. Los valores reales se configuran localmente o en la plataforma de despliegue, según el tipo de variable.

Ignorar un archivo no elimina automáticamente los secretos que ya se hayan confirmado en Git. Si un archivo fue subido previamente, es necesario comprobar el historial y aplicar las medidas de seguridad correspondientes.

### 8.3. Por qué Vite utiliza el prefijo `VITE_`

Vite expone las variables que empiezan por `VITE_` al código del cliente mediante `import.meta.env`.

Ejemplo:

```
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
```

Estas variables se sustituyen durante la compilación, por lo que sus valores pueden terminar incorporados en los archivos JavaScript que descarga el navegador.

Esto implica que cualquier valor con el prefijo `VITE_` debe tratarse como público. No se deben usar nombres como `VITE_DATABASE_PASSWORD`, `VITE_PRIVATE_TOKEN` o `VITE_SERVICE_ROLE_KEY` para guardar secretos.

La clave publicable de Supabase puede formar parte del frontend, pero la clave secreta o `service_role` nunca debe exponerse de esta forma.

La documentación oficial de Vite explica este comportamiento: [Variables de entorno y modos](<https://vite.dev/guide/env-and-mode>).

### 8.4. Diferencia entre secretos de build y secretos de runtime

Un secreto de build se utiliza durante el proceso que compila o prepara la aplicación. Por ejemplo, un workflow de GitHub Actions puede recibir un token desde GitHub Secrets para realizar una operación durante el despliegue.

Un secreto de runtime se utiliza mientras un servicio del servidor está funcionando. Por ejemplo, un backend puede leer una credencial desde la configuración protegida del entorno donde se ejecuta.

La diferencia importante no es solamente cuándo se utiliza el secreto, sino dónde termina su valor.

Si un secreto se introduce durante la compilación de una aplicación frontend y el proceso lo copia al JavaScript final, deja de ser secreto aunque originalmente proviniera de GitHub Secrets. Por eso, las credenciales privadas deben permanecer en procesos controlados del servidor o en servicios de backend.

### 8.5. Qué hacer si se publica una clave por error

Si una clave secreta aparece en un repositorio, la respuesta correcta es actuar como si alguien ya la hubiera obtenido.

1. **Revocar o rotar la clave expuesta.** Generar una nueva credencial y retirar la anterior cuando el proveedor lo permita.
2. **Actualizar las aplicaciones y servicios autorizados.** Comprobar que los sistemas utilizan la nueva credencial.
3. **Revisar los registros de actividad.** Buscar posibles usos no autorizados, cuando existan registros disponibles.
4. **Eliminar la clave del código actual.** Sustituirla por una variable de entorno o por un mecanismo de secretos apropiado.
5. **Revisar el historial de Git.** Si hace falta, limpiar el historial siguiendo un procedimiento controlado y coordinar la actualización de los clones.
6. **Prevenir nuevas filtraciones.** Revisar `.gitignore`, los permisos del repositorio y las herramientas de detección de secretos.

Borrar el archivo en un commit nuevo no elimina el secreto de los commits anteriores. Aunque se limpie el historial, la rotación sigue siendo necesaria porque una copia pudo haberse descargado o almacenado en otro lugar.

---

## 9\. Build y despliegue

### 9.1. Qué hace `npm run build`

El comando `npm run build` ejecuta el script `build` definido en `package.json`. En un proyecto Vite típico, este script ejecuta `vite build`.

Durante el proceso, Vite prepara los recursos de producción, procesa el código, optimiza los archivos y genera una carpeta `dist/`.

La carpeta puede incluir:

- `index.html`: documento principal de la aplicación.
- `assets/`: archivos JavaScript, CSS, imágenes y otros recursos procesados.
- Archivos estáticos copiados desde `public/`.
- Nombres de archivos con hashes para facilitar la gestión de caché.

El contenido exacto depende de las dependencias y de la configuración del proyecto. La carpeta generada es la que normalmente se publica en un hosting estático.

### 9.2. Minificación, tree shaking, code splitting y hashing

**Minificación:** reduce el tamaño de los archivos eliminando espacios innecesarios y simplificando el código sin cambiar su comportamiento previsto. Esto disminuye la cantidad de datos que se deben descargar.

**Tree shaking:** elimina código exportado que no se utiliza, cuando el empaquetador puede identificarlo con seguridad. Ayuda a reducir el JavaScript enviado al navegador.

**Code splitting:** divide el código en varios archivos o fragmentos que pueden cargarse cuando sean necesarios. Por ejemplo, una sección administrativa puede cargarse de forma diferida en vez de incluirse inmediatamente en el primer paquete de JavaScript.

**Hashing de nombres de archivo:** incorpora un identificador calculado a partir del contenido o de otros datos del recurso en el nombre del archivo. Por ejemplo, `index-a1b2c3.js`. Si el contenido cambia, el nombre normalmente también cambia, lo que facilita usar caché sin servir una versión antigua del archivo.

Estas técnicas pueden mejorar el rendimiento, aunque el resultado real depende del tamaño de la aplicación, de las dependencias y de cómo se carguen los recursos.

### 9.3. Qué es CI/CD

CI/CD reúne prácticas de integración continua y entrega o despliegue continuo.

- **Integración continua (CI):** automatiza verificaciones cuando se incorporan cambios al repositorio, como instalar dependencias, ejecutar pruebas y comprobar que el proyecto compila.
- **Entrega continua:** mantiene el código preparado para publicar una nueva versión cuando se cumplan las condiciones definidas.
- **Despliegue continuo:** automatiza también la publicación de cambios que superan las verificaciones, según las reglas del proyecto.

La automatización reduce errores manuales y ayuda a comprobar que el proyecto sigue funcionando después de incorporar cambios.

### 9.4. Qué es GitHub Actions

GitHub Actions es una plataforma de automatización integrada con GitHub. Utiliza archivos YAML, normalmente guardados en `.github/workflows/`, para definir tareas que se ejecutan ante eventos como un `push`, una solicitud de cambio o una ejecución manual.

Un workflow puede instalar dependencias, ejecutar pruebas, generar `dist/` y publicar los archivos en GitHub Pages.

Por ejemplo, un flujo sencillo de CI puede ejecutar:

```
- name: Instalar dependencias
  run: npm ci

- name: Compilar proyecto
  run: npm run build
```

Este fragmento ilustra dos pasos de un workflow; no constituye por sí solo una configuración completa para publicar el sitio.

### 9.5. Despliegue desde una rama `gh-pages` frente a GitHub Actions

**Despliegue desde una rama:** el sitio se publica desde una rama configurada para contener los archivos generados. Una herramienta o script puede construir el proyecto y enviar el contenido de `dist/` a la rama `gh-pages`. El método requiere mantener esa rama sincronizada con la compilación.

**Despliegue mediante GitHub Actions:** un workflow ejecuta los pasos necesarios, construye el proyecto y publica los artefactos usando los permisos y las acciones configurados. Puede realizar verificaciones antes de publicar y ejecutarse automáticamente al actualizar la rama principal.

La principal diferencia es que la segunda alternativa permite controlar de forma más explícita el proceso de compilación y publicación, sin depender necesariamente de una rama que almacene los archivos compilados.

Para un proyecto Vite + React, GitHub Actions resulta una alternativa adecuada porque permite comprobar el build antes de publicar y mantener el procedimiento documentado en el mismo repositorio.

## Fuentes consultadas

Puedes añadir esta bibliografía al final de `docs/despliegue.md`. Son documentación técnica y páginas oficiales apropiadas para respaldar las explicaciones y contrastar los límites de los servicios.

Escritura

1. **MDN Web Docs.** _How the web works_. https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Web_standards/How_the_web\_works
2. **ICANN.** _DNS and domain name resources_. https://www.icann.org/
3. **Cloudflare.** _What is DNS?_ https://www.cloudflare.com/learning/dns/what-is-dns/
4. **Let's Encrypt.** _How it works_. https://letsencrypt.org/how-it-works/
5. **MDN Web Docs.** _Transport Layer Security (TLS)_. https://developer.mozilla.org/en-US/docs/Web/Security/Transport_Layer_Security
6. **GitHub Docs.** _GitHub Pages limits_. https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits
7. **Netlify.** _Pricing_. https://www.netlify.com/pricing/
8. **Vercel.** _Hobby plan_. https://vercel.com/docs/plans/hobby
9. **Cloudflare.** _Pages limits_. https://developers.cloudflare.com/pages/platform/limits/
10. **Render.** _Static sites_. https://render.com/docs/static-sites
11. **Render.** _Deploy for free_. https://render.com/docs/free
12. **Supabase.** _Row Level Security_. https://supabase.com/docs/guides/database/postgres/row-level-security
13. **Supabase.** _API keys_. https://supabase.com/docs/guides/getting-started/api-keys
14. **Supabase.** _Redirect URLs_. https://supabase.com/docs/guides/auth/redirect-urls
15. **Supabase.** _Billing and usage_. https://supabase.com/docs/guides/platform/billing-on-supabase
16. **Supabase.** _Project pausing_. https://supabase.com/docs/guides/platform/free-project-pausing
17. **Vite.** _Env Variables and Modes_. https://vite.dev/guide/env-and-mode
18. **Namecheap.** _Domain pricing_. https://www.namecheap.com/domains/
19. **Namecheap.** _.co domain registration_. https://www.namecheap.com/domains/registration/cctld/co/
20. **Porkbun.** _Domain pricing_. https://porkbun.com/products/domains
21. **Porkbun.** _.co domain registration_. https://porkbun.com/tld/co/
22. **GitHub Docs.** _Understanding GitHub Actions_. https://docs.github.com/en/actions/about-github-actions
23. **GitHub Docs.** _Configuring a publishing source for your GitHub Pages site_. https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

**Fecha de consulta de las páginas de precios y límites:** 14 de octubre de 2026. Los valores y las condiciones pueden variar; conviene verificarlos antes de la entrega final.
