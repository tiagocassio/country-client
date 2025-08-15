export default function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-base-200">
      <div className="navbar bg-base-100 shadow-lg">
        <div className="navbar-start">
          <div className="skeleton w-32 h-8"></div>
        </div>
        <div className="navbar-center hidden lg:flex">
          <div className="skeleton w-24 h-6 mr-4"></div>
          <div className="skeleton w-24 h-6"></div>
        </div>
        <div className="navbar-end">
          <div className="skeleton w-32 h-10 mr-2"></div>
          <div className="skeleton w-10 h-10 rounded-full"></div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <div className="skeleton w-64 h-10 mx-auto mb-4"></div>
          <div className="skeleton w-96 h-6 mx-auto"></div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array.from({ length: 24 }).map((_, index) => (
            <div key={index} className="card bg-base-100 shadow-xl">
              <figure className="px-4 pt-4">
                <div className="skeleton w-full h-24 rounded-xl"></div>
              </figure>
              <div className="card-body p-4">
                <div className="skeleton w-20 h-4 mx-auto mb-2"></div>
                <div className="flex justify-center space-x-2 mt-2">
                  <div className="skeleton w-8 h-5 rounded"></div>
                  <div className="skeleton w-8 h-5 rounded"></div>
                </div>
                <div className="skeleton w-16 h-3 mx-auto mt-2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <footer className="footer footer-center p-10 bg-base-300">
        <div className="skeleton w-8 h-8 rounded-full mb-2"></div>
        <div className="skeleton w-48 h-6 mb-2"></div>
        <div className="skeleton w-64 h-4"></div>
      </footer>
    </div>
  );
}
