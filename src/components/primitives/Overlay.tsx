const Overlay: React.FC = ({ children }) => (
  <div className="fixed z-10 overflow-hidden bg-gray-700 rounded-lg shadow-md inset-2 bottom-16 lg:bottom-10">
    {children}
  </div>
)

export default Overlay
