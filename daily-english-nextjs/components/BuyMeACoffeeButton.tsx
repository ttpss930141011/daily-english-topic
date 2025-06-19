export default function BuyMeACoffeeButton() {
  return (
    <div className="flex justify-center py-8 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10">
      <a 
        href="https://coff.ee/o927416847f"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
      >
        <svg 
          className="w-5 h-5 mr-2" 
          viewBox="0 0 24 24" 
          fill="currentColor"
        >
          <path d="M20.216 6.415l-.132-.666c-.119-.598-.388-1.163-.766-1.658A4.52 4.52 0 0 0 15.98 2.5h-8.346A4.52 4.52 0 0 0 4.296 4.091c-.378.495-.647 1.06-.766 1.658L3.398 6.415C2.56 10.757 2.56 15.243 3.398 19.585l.132.666c.119.598.388 1.163.766 1.658A4.52 4.52 0 0 0 7.634 23.5h8.346a4.52 4.52 0 0 0 3.338-1.591c.378-.495.647-1.06.766-1.658l.132-.666c.838-4.342.838-8.828 0-13.17zM7.5 14.25a1.875 1.875 0 1 1 3.75 0 1.875 1.875 0 0 1-3.75 0zm5.25 0a1.875 1.875 0 1 1 3.75 0 1.875 1.875 0 0 1-3.75 0z"/>
          <path d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM8.625 8.625a.875.875 0 1 1 1.75 0 .875.875 0 0 1-1.75 0zm4.125 0a.875.875 0 1 1 1.75 0 .875.875 0 0 1-1.75 0z"/>
        </svg>
        <span>Buy me a coffee</span>
      </a>
      <div className="ml-4 text-center">
        <p className="text-gray-300 text-sm">
          Enjoying the lessons?
        </p>
        <p className="text-gray-400 text-xs">
          Support this project ☕
        </p>
      </div>
    </div>
  )
}