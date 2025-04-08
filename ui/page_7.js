async function Container7(doc) {
    // Retrieve imagesData from local storage
    const imagesData = JSON.parse(localStorage.getItem('imagesData'));
    console.log(imagesData);

    // Check if imagesData is valid
    if (!imagesData || !Array.isArray(imagesData)) {
        console.error('No valid images data found in local storage.');
        return;
    }

    // Initial settings
    const leftMargin = 25.7;  
    const rightMargin = 17.5; 
    const pageWidth = doc.internal.pageSize.getWidth();    
    let yPosition = 0;

    // Add logo on the right side
    const img = new Image();
    img.src = 'images/logo.png';

    const logoWidth = 30;
    const logoHeight = 30;
    const logoX = pageWidth - rightMargin - logoWidth - 6;
    yPosition += 2; 
    doc.addImage(img, 'PNG', logoX , yPosition, logoWidth, logoHeight);

    // Move yPosition downward to prevent overlap
    yPosition += logoHeight + 2;  

    // Set the position for the image grid
    const gridStartY = yPosition + 10; // Start position for the image grid
    const imageWidth = (pageWidth - leftMargin - rightMargin - 20) / 3; // Width for each image
    const imageHeight = imageWidth; // Maintain aspect ratio (square images)

    // Loop through the images and add them to the PDF in a 3x3 grid
    for (let i = 0; i < imagesData.length; i++) {
        const imgData = imagesData[i].src; // Get the image source
        const col = i % 3; // Column index (0, 1, 2)
        const row = Math.floor(i / 3); // Row index (0, 1, 2)
        const xPosition = leftMargin + col * (imageWidth + 10); // X position for the image
        const yPositionForImage = gridStartY + row * (imageHeight + 10); // Y position for the image

        // Add the image to the PDF
        await addImageToPDF(doc, imgData, 'JPEG', imageWidth, imageHeight, xPosition, yPositionForImage);
    }

    // Move yPosition down to just above the footer
    yPosition = gridStartY + Math.ceil(imagesData.length / 3) * (imageHeight + 10) + 10; // Adjust yPosition for footer

    return { getPosition: () => yPosition };
}



// Modify the addImageToPDF function to accept x and y positions
async function addImageToPDF(doc, imagePath, type, imageWidth, imageHeight, x, y) {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = imagePath;

        img.onload = function() {
            // Add the image to the PDF at the specified position
            doc.addImage(img, type, x, y, imageWidth, imageHeight);
            resolve(); // Resolve the promise when done
        };

        img.onerror = function() {
            console.error(`Error loading image: ${imagePath}`);
            resolve(); // Resolve even if there's an error
        };
    });
}

// Modify the addImageToPDF function to accept x and y positions
async function addImageToPDF(doc, imagePath, type, imageWidth, imageHeight, x, y) {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = imagePath;

        img.onload = function() {
            // Add the image to the PDF at the specified position
            doc.addImage(img, type, x, y, imageWidth, imageHeight);
            resolve(); // Resolve the promise when done
        };

        img.onerror = function() {
            console.error(`Error loading image: ${imagePath}`);
            resolve(); // Resolve even if there's an error
        };
    });
}

function createTable(doc, startY, title, subtitle = null) {
    let yPosition = startY;
        const pageWidth = doc.internal.pageSize.getWidth();
        const leftMargin = 25.7;  
        const rightMargin = 17.5; 
        const tableWidth = pageWidth - (leftMargin + rightMargin); 
            
        if (subtitle) {
            yPosition += 5;
            doc.rect(leftMargin, yPosition, tableWidth, 8);  
            doc.setFontSize(9);
            doc.text(subtitle, pageWidth / 2, yPosition + 5.5, { align: 'center' });
            yPosition += 8;
        }
            
        const col1Width = 60;
        const col2Width = tableWidth - col1Width;

         async function addImageToPDF(doc, imagePath, type,imageWidth, imageHeight) {
            return new Promise((resolve) => {
                const img = new Image();
                img.src = imagePath;
        
                img.onload = function() {
                const pageWidth = doc.internal.pageSize.getWidth();
                const leftMargin = 25.7;  
                const rightMargin = 17.5; 
                //const imageWidth = pageWidth - (leftMargin + rightMargin + 10); 
                const x = leftMargin + 1; // Start position for image
                //const imageHeight = 60; // Adjust as needed
        
                // Add the image to the PDF
                doc.addImage(img, type, x, yPosition, imageWidth, imageHeight);
                yPosition = yPosition + imageHeight + 5; // Update yPosition for the next element
                console.log('Image Start position:', x, yPosition);
                resolve(yPosition); // Return the new yPosition after adding the image
                };
        
                img.onerror = function() {
                    console.error(`Error loading image: ${imagePath}`);
                    resolve(yPosition); // Resolve with the current y position if the image fails to load
                };
            });
        }

        
    
        function addValuerDetails(description, value) {
            
            const splitDescription = doc.splitTextToSize(description, col1Width - 4);
            const splitValue = value ? doc.splitTextToSize(value, col2Width - 4) : [''];
           
            // Get number of lines for both description and value
            const descriptionLines = splitDescription.length;
            const valueLines = splitValue.length;
           
            // Use the maximum number of lines to determine height
            const maxLines = Math.max(descriptionLines, valueLines);
            const lineHeight = 3.5; 
            const padding = 2; // Minimum padding
           
            // Calculate height based on content
            let calculatedHeight = (maxLines * lineHeight) + padding; // Height for multiple lines
    
            // Draw the rectangle for the description and enter description
            doc.rect(leftMargin, yPosition, col1Width, calculatedHeight);
            doc.setFont('helvetica', 'normal');
            doc.text(splitDescription, leftMargin + 1, yPosition + 4);

            // Draw the rectangle for the value and enter value
            doc.rect(leftMargin + col1Width, yPosition, col2Width, calculatedHeight);
            doc.setFont('helvetica', 'bold');
            doc.text(splitValue, leftMargin + col1Width + 2, yPosition + 4);    

            yPosition += calculatedHeight;
            return yPosition;
        }
        
        function addSimpleLine(line) {
            // Split text for measurement
            const splitLine= doc.splitTextToSize(line, tableWidth - 4);
           
            // Get number of lines for both description and value
            const splitLineNo = splitLine.length;
          
            const lineHeight = 3.5; 
            const padding = 2; // Minimum padding
           
            // Calculate height based on content
            let calculatedHeight = (splitLineNo * lineHeight) + padding; // Height for multiple lines
    
            // Draw the rectangle for the line and enter lines
            //doc.rect(leftMargin, yPosition, tableWidth, calculatedHeight);
            doc.setFont('helvetica', 'normal');
            doc.text(splitLine, leftMargin + 1, yPosition + 4);         
            yPosition += calculatedHeight;
            return yPosition;
        }

        function addBox() {
            // Draw the rectangle for the line and enter lines
            doc.rect(leftMargin, yPosition, tableWidth, 40);                  
            yPosition += 18;
            return yPosition;
        }        

        function addImageTitle(doc, title) {
            const pageWidth = doc.internal.pageSize.getWidth();
            const leftMargin = 25.7;
            const rightMargin = 17.5;

            // Calculate title width using getStringUnitWidth for accuracy
            const fontSize = 12.8;
            const titleWidth = doc.getStringUnitWidth(title) * fontSize / doc.internal.scaleFactor;
            console.log('Title Width:', titleWidth);
            const xPosition = leftMargin + 1; // Start position for title
        
            yPosition += 5;
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(10);
            doc.text(title, xPosition, yPosition); // Use yPosition instead of doc.autoTable.previous.finalY
        
            yPosition += 1.5;
            // Underline the title
            const yPositionForUnderline = yPosition; // Adjust y position for underline
            doc.setLineWidth(0.5);
            doc.line(xPosition, yPositionForUnderline, xPosition + titleWidth, yPositionForUnderline);
            console.log('Title Start position:', xPosition);
            console.log('Title End position:', xPosition + titleWidth);
            yPosition += 2;
            return yPosition;
        }                       
       
return {  
    addImageTitle,
    addSimpleLine,     
    addValuerDetails,
    addBox,
    addImageToPDF,
    getPosition: () => yPosition
};
}

async function generatePDF() {
const { jsPDF } = window.jspdf;
const doc = new jsPDF();

await Container7(doc, Container_7)
addFooter(doc)
return doc;
}