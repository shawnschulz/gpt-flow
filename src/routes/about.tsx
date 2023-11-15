//put imports here
//
import './landing.css'
import gpt_flow_icon from "./images/gpt-flow-icon.png"
import shblog_icon from "./images/shblog-icon.png"
import gene_info_icon from "./images/gene_info_icon.png"
export default function about() { 
    return (
    <div>
      <div className="landing-info-container">
          <i> Hello and welcome to my website! </i>
      </div>
      <div className="project-icons-container">
        <a href="http://localhost:5173/shblog" target="_blank" rel="noopener noreferrer">
        <img src={shblog_icon} style= {{width: 220, height: 220, position: 'relative', left: 1}}/>
        </a>
        <a href="http://localhost:5173/" target="_blank" rel="noopener noreferrer">
          <img src={gpt_flow_icon} style= {{width: 220, height: 220, position: 'relative', left: 1}}/>
        </a>
        <a href="http://localhost:5173/gene_info_calculator" target="_blank" rel="noopener noreferrer">
          <img src={gene_info_icon} style= {{width: 220, height: 220, position: 'relative', left: 1}}/>
        </a>
      </div>
    </div>
    )
}
