// People Data and Honeycomb Network Logic
const people = [
    {
        name: "Dr. Mansee Bal Bhargava",
        details: "Host & Coordinator of this professional network. Researcher, Educator, Entrepreneur.",
        link: "index.html",
        tags: ["hub"],
        isHub: true
    },
    {
        name: "EDRC Fellows",
        details: "Research and Project Fellows until Dec 2020 & Aug 2021 at EDRC.",
        link: "http://www.mansee.in/wp-content/uploads/2021/08/RCF-BIO_Aug2021.pdf",
        tags: ["EDRC", "environmental"]
    },
    {
        name: "Akshay Bhargava",
        details: "Landscape Architect at Environmental Design Consultants (EDC) Ahmedabad.",
        link: "http://www.edc.org.in/",
        tags: ["EDC", "architect"]
    },
    {
        name: "Alka Bharat",
        details: "Prof and Head, Dept of Arch. & Planning, M.A.N.I.T. Bhopal.",
        link: "http://manit.ac.in/web/year2010/Profile/Architecture_Planning/Brief%20CV%20alka%20bharat%200810.pdf",
        tags: ["CEPT", "academic"]
    },
    {
        name: "Anil Gupta",
        details: "Professor-Mentor at IIMA, Srishti, HBN, NIF, etc.",
        link: "http://www.iimahd.ernet.in/~anilg/",
        tags: ["academic", "technology"]
    },
    {
        name: "Late Barry Moore",
        details: "Professor, Dept. of Land Economy, University of Cambridge, UK.",
        link: "http://www-old.dow.cam.ac.uk/index.php/about/news/456-moore",
        tags: ["Cambridge", "academic"]
    },
    {
        name: "Bibhu P Nayak",
        details: "Associate Professor, TISS Hyderabad.",
        link: "https://www.tiss.edu/view/9/employee/bibhu-prasad-nayak/",
        tags: ["TISS", "academic"]
    },
    {
        name: "BV Doshi",
        details: "Architect, Professor, and Pritzker Laureate Mentor at Sangath.",
        link: "http://www.sangath.org/",
        tags: ["CEPT", "architect"]
    },
    {
        name: "Carley Pennink",
        details: "Head, International Projects, IHS-Erasmus University Rotterdam.",
        link: "http://www.ihs.nl/about_ihs/ihs_staff/management_team/carley_pennink/",
        tags: ["IHS", "academic"]
    },
    {
        name: "Claudio Acioly",
        details: "Architect-Urban Planner, UN Habitat.",
        link: "http://unhabitat.org/tag/claudio-acioly/",
        tags: ["IHS", "architect"]
    },
    {
        name: "Donald Housing",
        details: "Institute for a Secure and Sustainable Environment, University of TN.",
        tags: ["academic", "environmental"]
    },
    {
        name: "Eduardo S. Brondizio",
        details: "Professor, Anthropology Department, Indiana University, Bloomington.",
        link: "http://www.indiana.edu/~anthro/people/faculty/ebrondiz.shtml",
        tags: ["Ostrom", "academic"]
    },
    {
        name: "Fawzia Taranum",
        details: "Assistant Professor, TERI School of Advance Sciences, Delhi.",
        link: "https://www.terisas.ac.in/faculty.php?id=50",
        tags: ["academic", "environmental"]
    },
    {
        name: "Gautamee Baviskar",
        details: "Urban Planner, Student, and Researcher.",
        link: "http://www.gautameebaviskar.wix.com/website",
        tags: ["academic"]
    },
    {
        name: "Ganesh Shankar",
        details: "Managing Director, Fluxgen Engineering Technologies.",
        link: "http://www.fluxgentech.com/home-1",
        tags: ["technology"]
    },
    {
        name: "Late Elinor Ostrom",
        details: "Nobel Laureate and Co-founder of The Ostrom Workshop, Indiana University.",
        link: "https://ostromworkshop.indiana.edu/about/nobelprize.html",
        tags: ["Ostrom", "academic"]
    },
    {
        name: "Gita Goven",
        details: "Architect and Urban Designer, ArgDesign CapeTown.",
        link: "http://argdesign.co.za/",
        tags: ["architect"]
    },
    {
        name: "Harsh Vardhan",
        details: "Environmentalist based in Jaipur.",
        link: "http://www.birdfair.org/",
        tags: ["environmental"]
    },
    {
        name: "Jacko van Ast",
        details: "Prof. Dept. of Public Administration, Faculty of Social Science, Erasmus University Rotterdam.",
        link: "http://www.eur.nl/fsw/english/publicadministration/contact/staff/profiel_mis/10101/",
        tags: ["IHS", "academic"]
    },
    {
        name: "Jaime Izurieta",
        details: "Architect, Urban Designer, and Manager.",
        link: "http://gkillcity.com/autor/jaime-izurieta-varea",
        tags: ["architect"]
    },
    {
        name: "Jan Fransen",
        details: "Deputy Director, IHS- Erasmus University Rotterdam.",
        link: "http://www.ihs.nl/about_ihs/ihs_staff/management_team/jan_fransen/",
        tags: ["IHS", "academic"]
    },
    {
        name: "Kenji Otsuka",
        details: "Director, Environment and Natural Resource Studies Group, IDE-JETRO.",
        link: "http://www.ide.go.jp/English/Researchers/otsuka_kenji_en.html",
        tags: ["academic", "environmental"]
    },
    {
        name: "Kinny Soni",
        details: "Architect and Interior Designer.",
        link: "http://kinnysoni.com/",
        tags: ["architect"]
    },
    {
        name: "Kirti Pathak",
        details: "Social Activist based in Ajmer.",
        tags: ["environmental"]
    },
    {
        name: "Klaus Eisenack",
        details: "Resource Economics Group, Humboldt-Universität zu Berlin.",
        link: "http://resource-economics.hu-berlin.de",
        tags: ["Ostrom", "academic"]
    },
    {
        name: "Madhubharti Sharma",
        details: "Professor, Faculty of Planning, CEPT University.",
        link: "http://cept.ac.in/10/110/faculty-of-planning/staffmember/56/madhu-bharti",
        tags: ["CEPT", "academic"]
    },
    {
        name: "Marco Janssen",
        details: "Professor, School of Sustainability and Director of CBIE, ASU Tempe.",
        link: "http://www.marcojanssen.info/",
        tags: ["Ostrom", "academic"]
    },
    {
        name: "Neelkanth Chhaya",
        details: "Architect and Professor.",
        link: "http://www.mandazhi.net/Neelkanthchhaya.html",
        tags: ["CEPT", "architect", "academic"]
    },
    {
        name: "Prabhat Kumar Singh",
        details: "Professor, Dept. of Civil Engineering, IIT-BHU.",
        link: "https://www.iitbhu.ac.in/dept/civ/people/psinghciv",
        tags: ["academic"]
    },
    {
        name: "Pratap Patil",
        details: "Architect and Urban Designer.",
        link: "http://www.pratapdpatil.com/",
        tags: ["architect"]
    },
    {
        name: "PVK Rameshwar",
        details: "Architect, Urban Designer, and Professor.",
        link: "http://www.shilanyas.com/about-us",
        tags: ["CEPT", "architect", "academic"]
    },
    {
        name: "Rolf Kunneke",
        details: "Professor of Economics of Infrastructures, TU Delft.",
        link: "http://www.tbm.tudelft.nl/en/about-faculty/professors/professor-profile/rolf-kuenneke/",
        tags: ["academic", "technology"]
    },
    {
        name: "Sanal Thathapuzha",
        details: "Architect.",
        link: "http://sanalthathapuzha.com/",
        tags: ["architect"]
    },
    {
        name: "Sandeep Sankat",
        details: "Architect-Professor, Department of Architecture, SPA Bhopal.",
        link: "http://www.spabhopal.ac.in/sandeepsankat.aspx",
        tags: ["academic", "architect"]
    },
    {
        name: "Sanjay Das",
        details: "Digital Transformation Leader, SAP- Europe at IBM.",
        link: "https://www.linkedin.com/in/sanjay-das-0174701?authType=name&authToken=-qoK&trk=wonton-desktop",
        tags: ["technology"]
    },
    {
        name: "Shrawan K Acharya",
        details: "Professor, School of Social Sciences, JNU, Delhi.",
        link: "http://www.jnu.ac.in/FacultyStaff/ShowProfile.asp?SendUserName=skacharya",
        tags: ["academic"]
    },
    {
        name: "Subhasish Borah and Bidisha Das",
        details: "Folklore and Kohuwa collectives.",
        link: "https://folkloretea.com/",
        tags: ["environmental"]
    },
    {
        name: "Tine de Moor",
        details: "Professor, RSM Erasmus University Rotterdam.",
        link: "https://www.rsm.nl/people/tine-de-moor/",
        tags: ["IHS", "academic"]
    },
    {
        name: "Ujjval Panchal",
        details: "Architect and Interaction Designer.",
        link: "http://www.ujjvalpanchal.com/",
        tags: ["architect", "technology"]
    },
    {
        name: "Urvi Sheth",
        details: "Director, Workshops at CEPT University.",
        link: "http://urvisheth.com/",
        tags: ["CEPT", "architect", "academic"]
    },
    {
        name: "Utpal Sharma",
        details: "Director at Institute of Architecture and Planning, Nirma University, Ahmedabad.",
        link: "http://www.nirmauni.ac.in/IANU/Faculty/Prof-Utpal-Kumar-Sharma",
        tags: ["academic"]
    },
    {
        name: "Zhang Zongyi",
        details: "SEM-Tongji University Shanghai.",
        link: "http://sem.tongji.edu.cn/semen/?p=12225",
        tags: ["IHS", "academic"]
    }
];

// Helper to calculate initials from name
function getInitials(name) {
    if (name.includes("EDRC")) return "ED";
    if (name.includes("and")) {
        const parts = name.split(" and ");
        return (parts[0][0] + (parts[1] ? parts[1][0] : '')).toUpperCase();
    }
    const parts = name.split(" ");
    const cleanParts = parts.filter(p => !p.toLowerCase().includes("dr.") && !p.toLowerCase().includes("late"));
    if (cleanParts.length >= 2) {
        return (cleanParts[0][0] + cleanParts[1][0]).toUpperCase();
    }
    return cleanParts[0] ? cleanParts[0].substring(0, 2).toUpperCase() : "MB";
}

// Helper to get primary category
function getPrimaryCategory(person) {
    if (person.isHub) return "hub";
    if (person.tags.includes("CEPT") || person.tags.includes("Ostrom") || person.name.includes("Barry Moore") || person.name.includes("Anil Gupta")) {
        return "mentor";
    }
    if (person.tags.includes("IHS") || person.tags.includes("EDRC") || person.tags.includes("EDC") || person.tags.includes("technology")) {
        return "collaborator";
    }
    return "peer";
}

const categoryColors = {
    mentor: "linear-gradient(135deg, #8a2be2, #da70d6)",       // Purple/Violet
    collaborator: "linear-gradient(135deg, #00b4d8, #0077b6)", // Cyan/Blue
    peer: "linear-gradient(135deg, #13ad89, #20bf55)",         // Emerald Green
};

// Generate gradient based on category
function getGradient(person) {
    if (person.isHub) {
        return "linear-gradient(135deg, #ff9f1c, #ff4000)"; // Gold/Amber hub
    }
    const cat = getPrimaryCategory(person);
    if (categoryColors[cat]) {
        return categoryColors[cat];
    }
    // Dynamic color fallback for new categories using a hash of the category name
    const colors = [
        ["#ff5e62", "#ff9966"], // Coral/Orange
        ["#de1159", "#f43f5e"], // Rose
        ["#ffb300", "#f57c00"], // Amber
        ["#9c27b0", "#e91e63"]  // Purple/Pink
    ];
    let hash = 0;
    for (let i = 0; i < cat.length; i++) {
        hash = cat.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return `linear-gradient(135deg, ${colors[index][0]}, ${colors[index][1]})`;
}

// Global active filter state
let currentFilter = "all";
let activeSearchQuery = "";
let selectedNodeIndex = null;

// Layout Grid Function
// Spiral Coordinates Generator
function generateSpiralCoords(maxNodes) {
    const coords = [{ q: 0, r: 0 }];
    let ring = 1;
    const dirs = [
        { dq: 0, dr: -1 },  // North-West
        { dq: -1, dr: 0 },  // West
        { dq: -1, dr: 1 },  // South-West
        { dq: 0, dr: 1 },   // South-East
        { dq: 1, dr: 0 },   // East
        { dq: 1, dr: -1 }   // North-East
    ];
    while (coords.length < maxNodes) {
        let q = ring;
        let r = 0;
        for (let d = 0; d < 6; d++) {
            for (let step = 0; step < ring; step++) {
                if (coords.length >= maxNodes) break;
                coords.push({ q, r });
                q += dirs[d].dq;
                r += dirs[d].dr;
            }
        }
        ring++;
    }
    return coords;
}

// Layout Grid Function (Concentric Spiral Grid)
function layoutGrid() {
    const grid = document.getElementById("honeycomb-grid");
    const container = grid.parentElement;
    if (!grid) return;

    const width = container.clientWidth;
    
    // Set hexagon sizes responsively
    let hexWidth = 120;
    let gap = 14;
    if (width < 768) {
        hexWidth = 95;
        gap = 10;
    }
    if (width < 480) {
        hexWidth = 72;
        gap = 8;
    }
    
    const hexHeight = hexWidth * 1.1547;
    const colWidth = hexWidth + gap;
    const rowHeight = hexHeight * 0.75 + gap * 0.866;
    
    // Filtered people
    const filteredPeople = people.map((p, idx) => ({ ...p, originalIdx: idx })).filter(p => {
        const matchesFilter = currentFilter === "all" || 
            (currentFilter === "mentor" && (p.tags.includes("CEPT") || p.tags.includes("Ostrom") || p.name.includes("Barry Moore") || p.name.includes("Anil Gupta"))) ||
            (currentFilter === "collaborator" && (p.tags.includes("IHS") || p.tags.includes("EDRC") || p.tags.includes("EDC") || p.tags.includes("technology"))) ||
            (currentFilter === "peer" && (p.tags.includes("academic") || p.tags.includes("architect") || p.tags.includes("environmental")));
            
        return p.isHub || matchesFilter;
    }).map(p => {
        const matchesSearch = p.name.toLowerCase().includes(activeSearchQuery) || 
            p.details.toLowerCase().includes(activeSearchQuery) ||
            p.tags.some(tag => tag.toLowerCase().includes(activeSearchQuery));
        return { ...p, matchesSearch };
    });

    // Clear grid
    grid.innerHTML = "";

    // Partition filtered people by category
    const hubNode = filteredPeople.find(p => p.isHub);
    const nonHubs = filteredPeople.filter(p => !p.isHub);

    // Get all unique categories (excluding hub) sorted to keep order stable
    const uniqueCats = Array.from(new Set(nonHubs.map(p => getPrimaryCategory(p)))).sort();

    // Group non-hubs by category
    const catGroups = {};
    uniqueCats.forEach(cat => {
        catGroups[cat] = nonHubs.filter(p => getPrimaryCategory(p) === cat);
    });

    // Generate pool of spiral coordinates (exactly matching number of nodes)
    const rawCoords = generateSpiralCoords(filteredPeople.length);

    // Separate center coordinate (0,0) and the rest
    const outerCoords = [];
    rawCoords.forEach(coord => {
        if (coord.q === 0 && coord.r === 0) return;
        // Convert hex coordinate to Cartesian position
        const x = coord.q * colWidth + coord.r * (colWidth / 2);
        const y = coord.r * rowHeight;
        outerCoords.push({ ...coord, x, y });
    });

    // Sort outer coordinates by X coordinate to arrange them into horizontal bands (Left to Right)
    outerCoords.sort((a, b) => a.x - b.x);

    const cellsData = [];

    // Assign hub to center (0,0)
    if (hubNode) {
        cellsData.push({ person: hubNode, xRaw: 0, yRaw: 0 });
    }

    // Assign coordinates to each category group in horizontal order (Left to Right)
    let coordIdx = 0;
    uniqueCats.forEach(cat => {
        const group = catGroups[cat];
        group.forEach(person => {
            const coord = outerCoords[coordIdx++];
            if (coord) {
                // Apply a minor radial push of 0.18 * hexWidth to clear the 1.35x larger center hub
                let xRaw = coord.x;
                let yRaw = coord.y;
                const d = Math.sqrt(coord.x * coord.x + coord.y * coord.y);
                if (d > 0) {
                    const push = hexWidth * 0.18; // Exactly clear the larger center node boundary
                    xRaw += (coord.x / d) * push;
                    yRaw += (coord.y / d) * push;
                }
                cellsData.push({ person, xRaw, yRaw });
            }
        });
    });

    // Calculate bounds of raw coordinates
    let minX = 0, maxX = 0, minY = 0, maxY = 0;
    if (cellsData.length > 0) {
        minX = Math.min(...cellsData.map(c => c.xRaw));
        maxX = Math.max(...cellsData.map(c => c.xRaw));
        minY = Math.min(...cellsData.map(c => c.yRaw));
        maxY = Math.max(...cellsData.map(c => c.yRaw));
    }

    const gridWidth = maxX - minX + hexWidth;
    const gridHeight = maxY - minY + hexHeight * 1.35; // Account for larger hub

    const globalXOffset = Math.max(0, (width - gridWidth) / 2) - minX;
    const globalYOffset = -minY + 20; // 20px padding at the top

    // Render Hexagons
    cellsData.forEach((cell) => {
        // Size the center hub 35% larger
        const currentHexWidth = cell.person.isHub ? hexWidth * 1.35 : hexWidth;
        const currentHexHeight = cell.person.isHub ? hexHeight * 1.35 : hexHeight;

        const xPos = cell.xRaw + globalXOffset - (currentHexWidth - hexWidth) / 2;
        const yPos = cell.yRaw + globalYOffset - (currentHexHeight - hexHeight) / 2;
        
        const cellEl = document.createElement("div");
        cellEl.className = `honeycomb-cell ${cell.person.isHub ? 'hub-node' : ''} ${!cell.person.matchesSearch ? 'search-mismatch' : ''}`;
        cellEl.style.left = `${xPos}px`;
        cellEl.style.top = `${yPos}px`;
        cellEl.style.width = `${currentHexWidth}px`;
        cellEl.style.height = `${currentHexHeight}px`;
        cellEl.dataset.index = cell.person.originalIdx;
        cellEl.tabIndex = 0;
        cellEl.setAttribute("role", "button");
        cellEl.setAttribute("aria-label", `View connections for ${cell.person.name}`);
        
        cellEl.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                cellEl.click();
            }
        });
        
        const hexIn = document.createElement("div");
        hexIn.className = "honeycomb-cell-in";
        hexIn.style.background = getGradient(cell.person);
        
        const content = document.createElement("div");
        content.className = "honeycomb-content";
        
        const nameLabel = document.createElement("div");
        nameLabel.className = "hex-name-label";
        nameLabel.textContent = cell.person.name;
        
        content.appendChild(nameLabel);
        hexIn.appendChild(content);
        cellEl.appendChild(hexIn);
        grid.appendChild(cellEl);
        
        cell.element = cellEl;
    });
    
    // Set grid height to contain items
    grid.style.height = `${gridHeight + 40}px`;

    // Attach Event Listeners
    setupInteractions(cellsData);
}

// Intersection logic to check if two nodes share connections
function areConnected(p1, p2) {
    if (p1.isHub || p2.isHub) return true; // Everyone is connected to Dr. Mansee
    return p1.tags.some(tag => tag !== "academic" && tag !== "architect" && tag !== "environmental" && p2.tags.includes(tag));
}

// Interaction Setup (Hover & Tap)
function setupInteractions(cellsData) {
    const detailsPanel = document.getElementById("honeycomb-details-panel");
    const placeholder = detailsPanel.querySelector(".panel-placeholder");
    const panelContent = detailsPanel.querySelector(".panel-content");
    const panelName = detailsPanel.querySelector(".panel-name");
    const panelTag = detailsPanel.querySelector(".panel-tag");
    const panelDesc = detailsPanel.querySelector(".panel-desc");
    const panelLink = detailsPanel.querySelector(".panel-link");
    const connectionsList = detailsPanel.querySelector(".connections-list");

    function updateDetails(person, index) {
        placeholder.classList.add("hidden");
        panelContent.classList.remove("hidden");
        panelName.innerText = person.name;
        
        // Show primary tags
        const primaryTags = person.tags.filter(t => t !== "academic" && t !== "architect" && t !== "environmental");
        panelTag.innerText = primaryTags.join(", ") || person.tags.join(", ");
        panelDesc.innerText = person.details;

        if (person.link) {
            panelLink.href = person.link;
            panelLink.classList.remove("hidden");
        } else {
            panelLink.classList.add("hidden");
        }

        // Show connected peers
        connectionsList.innerHTML = "";
        const peers = people.filter((p, i) => i !== index && areConnected(person, p));
        if (peers.length > 0) {
            peers.forEach(peer => {
                const peerTag = document.createElement("span");
                peerTag.className = "peer-badge";
                peerTag.innerText = peer.name;
                connectionsList.appendChild(peerTag);
            });
        } else {
            connectionsList.innerHTML = `<span class="no-peers">Dr. Mansee is the primary coordinator</span>`;
        }
    }

    function clearDetails() {
        if (selectedNodeIndex !== null) {
            const index = selectedNodeIndex;
            updateDetails(people[index], index);
        } else {
            placeholder.classList.remove("hidden");
            panelContent.classList.add("hidden");
        }
        cellsData.forEach(c => {
            c.element.classList.remove("dimmed");
            c.element.classList.remove("active");
        });
    }

    function highlightNode(hoveredIdx) {
        const hoveredCell = cellsData.find(c => c.person.originalIdx === hoveredIdx);
        if (!hoveredCell) return;

        const hoveredCategory = getPrimaryCategory(hoveredCell.person);

        cellsData.forEach(c => {
            const category = getPrimaryCategory(c.person);
            if (hoveredCell.person.isHub) {
                // Hovering over center hub lights up all tiles
                c.element.classList.add("active");
                c.element.classList.remove("dimmed");
            } else {
                // Hovering over category node lights up its group + the center hub
                if (category === hoveredCategory || c.person.isHub) {
                    c.element.classList.add("active");
                    c.element.classList.remove("dimmed");
                } else {
                    c.element.classList.remove("active");
                    c.element.classList.add("dimmed");
                }
            }
        });
    }

    // Attach HTML listeners
    cellsData.forEach(cell => {
        const idx = cell.person.originalIdx;
        
        cell.element.addEventListener("mouseenter", () => {
            highlightNode(idx);
            updateDetails(cell.person, idx);
        });

        cell.element.addEventListener("mouseleave", () => {
            clearDetails();
        });

        // Touch/Click Toggle
        cell.element.addEventListener("click", (e) => {
            e.stopPropagation();
            if (selectedNodeIndex === idx) {
                selectedNodeIndex = null;
                clearDetails();
            } else {
                selectedNodeIndex = idx;
                highlightNode(idx);
                updateDetails(cell.person, idx);
            }
        });
    });

    // Clear on clicking anywhere outside grid
    document.addEventListener("click", () => {
        selectedNodeIndex = null;
        clearDetails();
    });
}

// Init Setup on Load
document.addEventListener("DOMContentLoaded", () => {
    layoutGrid();
    window.addEventListener("resize", layoutGrid);

    // Search Box Listener
    const search = document.getElementById("honeycomb-search");
    if (search) {
        search.addEventListener("input", (e) => {
            activeSearchQuery = e.target.value.toLowerCase().trim();
            layoutGrid();
        });
    }

    // Filter Buttons Listener
    const buttons = document.querySelectorAll(".filter-btn");
    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            buttons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            currentFilter = btn.dataset.filter;
            layoutGrid();
        });
    });
});
