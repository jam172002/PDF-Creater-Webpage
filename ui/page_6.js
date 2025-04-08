
async function Container6(doc) {
    const Container_6 = JSON.parse(localStorage.getItem('Container_6'));
    console.log(Container_6);
    const googleMapData = JSON.parse(localStorage.getItem('googleMapData'));
    const glImageData = JSON.parse(localStorage.getItem('glImageData'));
    console.log(googleMapData);
    console.log(glImageData);
    
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


    const font_size = 8;
    doc.setFontSize(font_size);

    let table = createTable(doc, yPosition, '', '');
    let yPos = table.getPosition();

    // TOTAL ABSTRACT OF THE ENTIRE PROPERTY
    yPos = table.addValuerDetails('Name of the Valuer', 'Mr BALAKRISHNA R');
    yPos = table.addValuerDetails('Address', '# 240/C, First floor, 3rd Block, Nagarabhavi 2nd stage, Bangalore-560072');
    yPos = table.addValuerDetails('Name of valuer association of which I am a bonafide member in good standing ', 'Indian Institute of Engineers');
    yPos = table.addValuerDetails('Wealth tax Registration No ', 'CAT-I/Reg.No.02/PCIT-I/CCIT/BNG-1/2023-24');
    yPos = table.addBox();
    yPos = table.addSimpleLine('Seal & Signature of the Valuer');
    yPos = table.addSimpleLine('Date        : 2nd  DECEMBER 2024');
    yPos = table.addSimpleLine('Mobile No   : 9743142447');
    yPos = table.addSimpleLine('Email       : balakrishna@truepeak.in');
    console.log('yPos:', yPos);
    // Add Title
    yPos = table.addImageTitle(doc, "GOOGLEMAP:");  
    yPos = table.addSimpleLine('Longitude & Latitude Points: 13.024953, 77.594695');

    // Load and add the Google Map image
    if (googleMapData) {
        yPos = await table.addImageToPDF(doc, googleMapData.src, 'JPEG', googleMapData.width, googleMapData.height);
    }
   
    // Add Title
    yPos = table.addImageTitle(doc, "GOOGLEMAP:");  
    yPos = table.addSimpleLine('Longitude & Latitude Points: 13.024953, 77.594695');

    // Load and add the guideline rate image
    if (glImageData) {                
        yPos =  await table.addImageToPDF(doc, glImageData.src, 'JPEG', glImageData.width, glImageData.height);
    }
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

await Container6(doc, Container_6)
addFooter(doc)
return doc;
}