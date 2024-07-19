import { Tag } from 'antd'

const WsWrapper = ({list, type}) => {
  return (
    <>
        {list?.length > 0 ?
            <div className='mb-6 md:mb-8'>
                <p className="mb-3 text-black font-medium text-lg md:text-xl">{type}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-y-3 gap-x-2 md:gap-x-6">
                    {list?.map((item, index) => (
                        <Tag className='lg:h-8' key={index}>
                            <p className='lg:text-lg'>
                                {item.value}
                            </p>
                        </Tag>
                    ))}
                </div>
            </div>
            :
            <p className='text-md p-1 bg-gray-50 text-center border rounded-md font-medium mb-5'>
                {`${type} Not Found!`}
            </p>

        }
    </>
  )
}

export default WsWrapper