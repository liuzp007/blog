import { useMemo, memo } from 'react'
import Prism from 'prismjs'
import 'prismjs/themes/prism.css'
import '../../styles/3_components/ui/beautify-code.css'

/** Sanitize highlighted HTML: remove <script> tags and on* event handlers */
function sanitizeHighlightedHtml(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]*)/gi, '')
}

interface BeautifyCodeProps {
  code: string
}

const BeautifyCode = memo(function BeautifyCode({ code }: BeautifyCodeProps) {
  const highlightedHtml = useMemo(
    () => sanitizeHighlightedHtml(Prism.highlight(code, Prism.languages.javascript, 'css')),
    [code]
  )

  return code ? (
    <pre className="beautify-code language-js line-numbers">
      <code className="language-js" dangerouslySetInnerHTML={{ __html: highlightedHtml }} />
    </pre>
  ) : null
})

interface BeautifyCodeListProps {
  list: string[] | Record<string, string>
}

const BeautifyCodeList = memo(function BeautifyCodeList({ list }: BeautifyCodeListProps) {
  const items = useMemo(() => {
    if (Array.isArray(list)) return list.map((i, index) => <BeautifyCode code={i} key={index} />)
    return Object.keys(list).map((i, index) => <BeautifyCode code={list[i]} key={index} />)
  }, [list])

  return <>{items}</>
})

export default BeautifyCode
export { BeautifyCode, BeautifyCodeList }
