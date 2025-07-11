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
  } catch (error) {
    console.error(error)
  }
})

async function loadTickets() {
  try {
    const response = await databases.listDocuments(databaseId, collectionId, [
      Appwrite.Query.orderDesc('$sequence'),
    ])
    const ticketList = document.getElementById('ticket-list')
    const ticketCount = document.getElementById('ticket-count')
    const emptyState = document.getElementById('empty-state')

    ticketList.innerHTML = ''

    if (response.documents.length === 0) {
      emptyState.style.display = 'block'
      ticketCount.textContent = '0 tickets'
    } else {
      emptyState.style.display = 'none'
      ticketCount.textContent = `${response.documents.length} ticket${
        response.documents.length === 1 ? '' : 's'
      }`

      response.documents.forEach((ticket, index) => {
        const ticketElement = document.createElement('div')
        ticketElement.className = 'card u-padding-24'
        ticketElement.innerHTML = `
          <div class="tag is-color-primary u-margin-block-end-12">
            #${String(ticket.$sequence).padStart(3, '0')}
          </div>
          <h3 class="heading-level-6 u-margin-block-end-8">${ticket.title}</h3>
          <p class="body-text-2">${ticket.body}</p>
        `
        ticketList.appendChild(ticketElement)
      })
    }
  } catch (error) {
    console.error(error)
  }
}

loadTickets()
