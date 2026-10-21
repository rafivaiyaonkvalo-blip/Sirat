import fs from 'node:fs'
import path from 'node:path'

// lessons.json (≈৮ MB) থেকে প্রতিটি পর্বের steps (≈৬.৪ MB) আলাদা করে প্রতিটি পাঠের জন্য ছোট চাঙ্কে দেয়।
// মূল ফাইল অপরিবর্তিত থাকে (কনটেন্ট-এডিটের স্ক্রিপ্ট আগের মতো lessons.json-ই লেখে);
// অ্যাপ lessons.json import করলে পায় steps-ছাড়া সংস্করণ (প্রতি পর্বে stepCount)।
// পাঠ খুললে src/data/lessonSteps.js দিয়ে ধাপগুলো লোড হয়।
export default function lessonStepsSplit() {
  const LESSONS = path.resolve('src/data/lessons.json')
  const NUL = String.fromCharCode(0)
  const STRIPPED = NUL + 'virtual:lessons-stripped'
  const LOADERS = 'virtual:lesson-steps-loaders'
  const STEPS_PREFIX = 'virtual:lesson-steps/'
  let cache = null
  const read = () => {
    if (!cache) cache = JSON.parse(fs.readFileSync(LESSONS, 'utf8'))
    return cache
  }
  const asModule = (value) => `export default JSON.parse(${JSON.stringify(JSON.stringify(value))});`

  return {
    name: 'lesson-steps-split',
    enforce: 'pre',
    resolveId(source, importer) {
      if (source === LOADERS) return NUL + LOADERS
      if (source.startsWith(STEPS_PREFIX)) return NUL + source
      if (importer && /(^|[\/])lessons\.json$/.test(source)) {
        const abs = path.resolve(path.dirname(importer.split('?')[0]), source)
        if (abs === LESSONS) return STRIPPED
      }
      return null
    },
    load(id) {
      if (id === STRIPPED) {
        const data = read()
        return asModule({
          ...data,
          lessons: data.lessons.map((lesson) => ({
            ...lesson,
            bookStages: Array.isArray(lesson.bookStages)
              ? lesson.bookStages.map(({ steps, ...stage }) => ({ ...stage, stepCount: (steps || []).length }))
              : lesson.bookStages
          }))
        })
      }
      if (id === NUL + LOADERS) {
        const entries = read().lessons
          .filter((l) => Array.isArray(l.bookStages) && l.bookStages.length)
          .map((l) => `  ${JSON.stringify(l.id)}: () => import(${JSON.stringify(STEPS_PREFIX + l.id)})`)
        return `export default {\n${entries.join(',\n')}\n};`
      }
      if (id.startsWith(NUL + STEPS_PREFIX)) {
        const lessonId = id.slice((NUL + STEPS_PREFIX).length)
        const lesson = read().lessons.find((l) => l.id === lessonId)
        return asModule((lesson?.bookStages || []).map((s) => s.steps || []))
      }
      return null
    },
    handleHotUpdate({ file, server }) {
      if (path.resolve(file) === LESSONS) {
        cache = null
        server.ws.send({ type: 'full-reload' })
        return []
      }
    }
  }
}
