// Context object containing FOAM2 DAOs for releases, APIs, and their relations
const ctx = require('./setup.js')
// Shorthand for "Confluence's package path"
const pkg = org.chromium.apis.web
// Facade for query expressions
const E = foam.mlang.ExpressionsSingleton.create()

//
// What APIs are on the latest Chrome?
//
ctx.releaseDAO
  // Filter: Release.BROWSER_NAME = 'Chrome'
  .where(E.EQ(pkg.Release.BROWSER_NAME, 'Chrome'))
  // Use DESC expression (descending order) on PROPERTY_NAME from class
  .orderBy(E.DESC(pkg.Release.RELEASE_DATE))
  // Just one result please (the latest)
  .limit(1)
  // Run the query
  .select()
  // Get a foam.dao.ArraySink containing release; extract it form "array"
  .then(arraySink => arraySink.array[0])
  .then(latestChrome => {
    // Get the answer in terms of Browser/API junction objects
    ctx.releaseWebInterfaceJunctionDAO.where(
      E.EQ(pkg.ReleaseWebInterfaceJunction.SOURCE_ID, latestChrome.id))
      .select().then(arraySink => {
        const junctions = arraySink.array
        console.log('Latest chrome is')
        console.log(foam.json.objectify(latestChrome))
        console.log(`with ${junctions.length} APIs`)
        console.log(`here's a random Browser/API junction:`)
        console.log(foam.json.objectify(
          junctions[Math.floor(Math.random() * junctions.length)]))
      })
  })

//
// What APIs are in latest Edge, but not latest Chrome?
//
Promise.all([
  // Get latest Edge and Chrome
  ctx.releaseDAO
    .where(E.EQ(pkg.Release.BROWSER_NAME, 'Edge'))
    .orderBy(E.DESC(pkg.Release.RELEASE_DATE))
    .limit(1)
    .select().then(arraySink => arraySink.array[0]),
  ctx.releaseDAO
    .where(E.EQ(pkg.Release.BROWSER_NAME, 'Chrome'))
    .orderBy(E.DESC(pkg.Release.RELEASE_DATE))
    .limit(1)
    .select().then(arraySink => arraySink.array[0]),
]).then(releases => Promise.all([
  // Get arrays of junctions for the two browsers
  ctx.releaseWebInterfaceJunctionDAO.where(
    E.EQ(pkg.ReleaseWebInterfaceJunction.SOURCE_ID, releases[0].id))
    .select().then(arraySink => arraySink.array),
  ctx.releaseWebInterfaceJunctionDAO.where(
    E.EQ(pkg.ReleaseWebInterfaceJunction.SOURCE_ID, releases[1].id))
    .select().then(arraySink => arraySink.array)
])).then(junctionses => junctionses
         // Map junctions to string ids
         .map(junctions => junctions.map(junction => junction.targetId)))
  .then(apiNameses => {
    // Some operations are fastest performed manually;
    // Set-minus the Edge API ids - the Chrome API ids
    const edgeAPIs = apiNameses[0]
    const chromeAPIs = apiNameses[1]
    let apis = []
    for (const api of edgeAPIs) {
      if (!chromeAPIs.includes(api)) apis.push(api)
    }
    console.log(`Latest Edge - Latest Chrome has ${apis.length} APIs`)
    console.log(`here's a random one:
                     ${apis[Math.floor(Math.random() * apis.length)]}`)
})

//
// What browsers support CSSStyleDeclaration#webkitTapHighlightColor?
//
ctx.releaseWebInterfaceJunctionDAO.where(
  E.EQ(pkg.ReleaseWebInterfaceJunction.TARGET_ID,
       'CSSStyleDeclaration#webkitTapHighlightColor'))
  .select().then(arraySink => arraySink.array)
  .then(junctions => {
    console.log('Releases with CSSStyleDeclaration#webkitTapHighlightColor:')
    console.log(junctions.map(junction => junction.sourceId).join(', '))
  })
