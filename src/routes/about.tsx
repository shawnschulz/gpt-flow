//put imports here
//
import './landing.css'
import gpt_flow_icon from "./images/gpt-flow-icon.png"
import shblog_icon from "./images/shblog-icon.png"
import gene_info_icon from "./images/gene_info_icon.png"
import itch_icon from "./images/itch_icon.png"
import github_icon from "./images/github.png"
import linkedin_icon from "./images/linkedin.png"
export default function about() { 
    return (
    <div>
      <div style={{ width: '100vw', height: '96vh' }}>
      <div className="landing-info-container">
          <i> Hello and welcome to my website! I'm Shawn, a computational biologist and data scientist. Click on one of the icons below to check out the projects I'm working on!</i>
      </div>
      <div className="project-icons-container">
        <a href="/shblog" target="_blank" rel="noopener noreferrer">
        <img src={shblog_icon} style= {{width: 220, height: 220, position: 'relative', left: 1}}/>
        </a>
        <a href="/" target="_blank" rel="noopener noreferrer">
          <img src={gpt_flow_icon} style= {{width: 220, height: 220, position: 'relative', left: 1}}/>
        </a>
        <a href="/gene_info_calculator" target="_blank" rel="noopener noreferrer">
          <img src={gene_info_icon} style= {{width: 220, height: 220, position: 'relative', left: 1}}/>
        </a>
        <a href="https://bankerz.itch.io/" target="_blank" rel="noopener noreferrer">
          <img src={itch_icon} style= {{width: 220, height: 220, position: 'relative', left: 1}}/>
        </a>
      </div>
        
      <div className = "social-media-container">
        <a href="https://www.linkedin.com/in/shawn-schulz-151b0313b/" target="_blank" rel="noopener noreferrer">
          <img src={linkedin_icon} style= {{width: 60, height: 60, position: 'relative', left: 1}}/>
        </a>
        <a href="https://github.com/shawnschulz" target="_blank" rel="noopener noreferrer">
            <img src={github_icon} style= {{width: 60, height: 60, position: 'relative', left: 1}}/>
        </a>
      </div>

      </div>
    </div>
    )
}
