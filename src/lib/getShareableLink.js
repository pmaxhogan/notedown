export default async function getShareableLink(documentID) {
    let link = "https://notedown-web.web.app/markdown";
    return link+documentID;
}