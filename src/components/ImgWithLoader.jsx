import { useState } from 'react'
import { Loader } from './Loader'

export const ImgWithLoader = ({
  src,
  alt,
  className = '',
  containerClassName = '',
  loaderClassName = '',
  onClick,
}) => {
  const [loaded, setLoaded] = useState(false)

  return (
    <div
      className={`relative overflow-hidden flex items-center justify-center ${containerClassName}`}
      onClick={onClick}
    >
      {!loaded && (
        <div
          className={`absolute inset-0 flex items-center justify-center ${loaderClassName}`}
        >
          <Loader />
        </div>
      )}

      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
        className={`transition-opacity duration-300 object-cover ${
          loaded ? 'opacity-100' : 'opacity-0'
        } ${className}`}
      />
    </div>
  )
}