import type { Metadata } from 'next';
import Image from 'next/image';
import Script from 'next/script';
import "./aurelia.css"

export const metadata: Metadata = {
  title: 'Aurelia',
};

export default function Aurelia() {
  return (
    <>
    <div id="wrapper">
				<div id="sidebar">
					<div id="aboutInfo">
						<Image
              id="profile"
              src="/experiences/aurelia/pfp.png"
              alt="Logo"
              width={200}
              height={200}
            />
						<h2>My Abilities</h2>
						<p>I am specialized in dealing with mind altering or otherwise psychological effects and creatures,
						but I can also diagnose most magical disturbances and refer you to an expert when
						physical force is required.</p>
						<p>In addition to my expertise, I also possess the ability to enter the
						minds of my clients when physical contact is made, allowing me to screen for any magical
						influnces directly.</p>
					</div>

					<div id="contactInfo">
						<h2 id="CIHeader">Contact Information</h2>
						<div>
							<Image 
              id="iconImage" 
              src="/experiences/aurelia/phoneIcon.png" 
              alt="phone" 
              width={200} 
              height={200}
              />
							<p className="CCInfo">555-824-2345</p>
						</div>
						<div>
							<Image id="iconImage" src="/experiences/aurelia/HomeIcon.png" alt="home" width={200} height={200} />
							<p className="CCInfo">
							123 Fake Loc<br></br>
							New York, NY<br></br>
							1234-5678
							</p>
						</div>
						<div>
							<Image className="iconImage" src="/experiences/aurelia/MailIcon.png" alt="email" width={200} height={200}/>
							<p className="CCInfo">Awalker@Dreamwalkers.com</p>
						</div>
						<div>
							<Image className="iconImage" src="/experiences/aurelia/Scryglass.png" alt="ScryglassIcon" width={200} height={200}/>
							<p className="CCInfo">🜀 - 🜚 - 🝒 - 🜛 - 🝆 - 🜾</p>
						</div>
					</div>
				</div>

				<div id="unlockedSite">
					<div id="header">
						<h1>One Touch Investigations</h1>
						<p>Private Investigation - Magical Expertise - Memory Recovery</p>
					</div>

					<nav id="fileNav">
						<div>
							<button id="file1" className="cfButton">File 1</button>
						</div>
						<div>
							<button id="file2" className="cfButton">File 2</button>
						</div>
						<div>
							<button id="file3" className="cfButton">File 3</button>
						</div>
						<div>
							<button id="file4" className="cfButton">About me</button>
						</div>
						<div>
							<button id="fileAbout" className="cfButton" >About Me</button>
						</div>
					</nav>

					<section id="caseFile">
						<div className="caseFileHead">
						</div>
						<div className="caseFileBody">
						</div>
					</section>
				</div>
			</div>

      {/* Script */}
      <Script type="module" src="/scripts/aurelia/index.js" strategy="afterInteractive" />
    </>
  );
}
