import { useContext } from "react"
import { ChatContext } from "../../context/ChatContext.jsx"
import ChatContainer from "../components/ChatContainer.jsx"
import RightSidebar from "../components/RightSidebar.jsx"
import Sidebar from "../components/Sidebar.jsx"

/* in the homepage there will be 3 columns/components
left column : sidebar (the users list)
middle column : chat container (the main chatting space)
right column : RightSidebar (the user profile column)

so in the homepage we have to call these 3 components
*/
function HomePage() {

    const {selectedUser} = useContext(ChatContext)//when selected user will be false that is not selected then only 2 columns will appear..the left sidebar(users list) and a chat anytime column and when user will be selected then 3 columns will appear

    return (
        <div className="border w-full h-screen sm:px-[15%] sm:py-[5%]">
            <div className={`backdrop-blur-3xl border-2 border-gray-900 rounded-2xl overflow-hidden h-full grid grid-cols-1 relative
                ${selectedUser ? 'md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]'  : "md:grid-cols-2"}
                `}>{/* when user will be selected then 3 columns will appear and when selected user will be false that is not selected then only 2 columns will appear (: "md:grid-cols-2") abd if the screen is small then there will be only 1 column..so sidebar,chatContainer and rightSidebar will be in a single column  */}
                <Sidebar /> {/* the 3 components are called */}
                <ChatContainer />
                <RightSidebar  />
            </div>
        </div>
    )
}

export default HomePage