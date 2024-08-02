import SidebarWithHeader from "../sidebar-with-header"
import JsonSection from "./JsonSection"

const CompareJsons = () => {
  return (
    <SidebarWithHeader>
        <div>
            {/* head */}
            <p className="text-xl md:text-3xl mt-1 mb-2 md:mb-0 font-medium">Compare Jsons</p>

            {/* body */}
            <div className="mt-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 divide-x-4">
                    <JsonSection />
                    <JsonSection />
                </div>
            </div>
            
        </div>
    </SidebarWithHeader>
  )
}

export default CompareJsons