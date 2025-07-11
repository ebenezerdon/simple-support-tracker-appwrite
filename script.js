const client = new Appwrite.Client()

client
  .setEndpoint('https://fra.cloud.appwrite.io/v1') // e.g., https://fra.cloud.appwrite.io/v1
  .setProject('66f6aece003e147b3811') // Replace with your Project ID

const databases = new Appwrite.Databases(client)

const databaseId = 'support-db' // Replace with your Database ID
const collectionId = 'tickets' // Replace with your Collection ID

const form = document.getElementById('ticket-form')

form.addEventListener('submit', async (e) => {
  e.preventDefault()

  const title = document.getElementById('title').value.trim()
  const body = document.getElementById('body').value.trim()

  if (!title || !body) return

  try {
    await databases.createDocument(databaseId, collectionId, 'unique()', {
      title,
      body,
    })

    form.reset()
    loadTickets()
  } catch (err) {
    console.error('Error creating document:', err)
  }
})

async function loadTickets() {
  try {
    const response = await databases.listDocuments(databaseId, collectionId, [
      Appwrite.Query.orderDesc('$sequence'),
    ])

    const container = document.getElementById('ticket-list')
    container.innerHTML = ''

    response.documents.forEach((doc) => {
      const div = document.createElement('div')
      div.className = 'ticket'
      div.innerHTML = `
        <strong>Ticket #${doc.$sequence}</strong>
        <p>${doc.title}</p>
        <small>${doc.body}</small>
      `
      container.appendChild(div)
    })
  } catch (err) {
    console.error('Error loading documents:', err)
  }
}

loadTickets() // Load on page load
