require('foam2')
require('confluence/lib/dao_container.es6.js')
require('confluence/lib/web_apis/release_interface_relationship.es6.js')
const pkg = org.chromium.apis.web

const getDAO = (cls, url, ctx) =>
        foam.dao.RestDAO.create({
          baseURL: url,
          // Specify class of objects in collection
          of: cls,
        }, ctx)

const setup = () => {
  // Automatic joins between "As" and "Bs" via "A-B Junctions" requires
  // specifying a shared context for all three collections.
  const ctx = pkg.DAOContainer.create()

  // Releases (e.g., Chrome 62 on Windows 10).
  const releaseDAO = getDAO(
    pkg.Release,
    'https://web-confluence.appspot.com/releaseDAO',
    ctx)
  // APIs (e.g., Document#getElementById, Node#firstChild).
  const webInterfaceDAO = getDAO(
    pkg.WebInterface,
    'https://web-confluence.appspot.com/webInterfaceDAO',
    ctx)
  // Release / API junction objects: sourceId=id-of-release, targetId=id-of-API
  const releaseWebInterfaceJunctionDAO = getDAO(
    pkg.ReleaseWebInterfaceJunction,
    'https://web-confluence.appspot.com/releaseWebInterfaceJunctionDAO',
    ctx)

  // Attach DAOs to context
  ctx.releaseDAO = releaseDAO
  ctx.webInterfaceDAO = webInterfaceDAO
  ctx.releaseWebInterfaceJunctionDAO = releaseWebInterfaceJunctionDAO

  return ctx
}

module.exports = setup()
