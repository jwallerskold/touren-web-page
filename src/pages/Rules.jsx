import { useData } from '../context/DataContext'

export default function Rules() {
  const { rules, isLoading } = useData()

  if (isLoading) {
    return <div className="text-center py-12">Laddar...</div>
  }

  // Simple markdown-like rendering
  const renderMarkdown = (text) => {
    const lines = text.split('\n')
    const elements = []
    let currentList = []
    let listType = null

    const flushList = () => {
      if (currentList.length > 0) {
        if (listType === 'ul') {
          elements.push(
            <ul key={elements.length} className="list-disc list-inside mb-4 space-y-1">
              {currentList.map((item, i) => (
                <li key={i} className="text-gray-700">{item}</li>
              ))}
            </ul>
          )
        } else {
          elements.push(
            <ol key={elements.length} className="list-decimal list-inside mb-4 space-y-1">
              {currentList.map((item, i) => (
                <li key={i} className="text-gray-700">{item}</li>
              ))}
            </ol>
          )
        }
        currentList = []
        listType = null
      }
    }

    lines.forEach((line, index) => {
      // Headers
      if (line.startsWith('# ')) {
        flushList()
        elements.push(
          <h1 key={index} className="text-3xl font-bold text-gray-800 mb-4">
            {line.slice(2)}
          </h1>
        )
      } else if (line.startsWith('## ')) {
        flushList()
        elements.push(
          <h2 key={index} className="text-2xl font-bold text-gray-800 mt-8 mb-4">
            {line.slice(3)}
          </h2>
        )
      } else if (line.startsWith('### ')) {
        flushList()
        elements.push(
          <h3 key={index} className="text-xl font-bold text-gray-800 mt-6 mb-3">
            {line.slice(4)}
          </h3>
        )
      }
      // Unordered list items
      else if (line.startsWith('- ')) {
        if (listType !== 'ul') {
          flushList()
          listType = 'ul'
        }
        // Handle bold text
        const content = line.slice(2).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        currentList.push(<span dangerouslySetInnerHTML={{ __html: content }} />)
      }
      // Ordered list items
      else if (/^\d+\. /.test(line)) {
        if (listType !== 'ol') {
          flushList()
          listType = 'ol'
        }
        const content = line.replace(/^\d+\. /, '').replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        currentList.push(<span dangerouslySetInnerHTML={{ __html: content }} />)
      }
      // Empty lines
      else if (line.trim() === '') {
        flushList()
      }
      // Regular paragraphs
      else {
        flushList()
        const content = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        elements.push(
          <p key={index} className="text-gray-700 mb-4" dangerouslySetInnerHTML={{ __html: content }} />
        )
      }
    })

    flushList()
    return elements
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-md p-8">
        {renderMarkdown(rules)}
      </div>
    </div>
  )
}
