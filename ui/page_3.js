function Container3(doc) {
    const Container_3 = JSON.parse(localStorage.getItem('Container_3'));
    console.log(Container_3);
    const actualsData = JSON.parse(localStorage.getItem('actualsData')) || [];
    const planData = JSON.parse(localStorage.getItem('planData')) || [];
    // Initial settings
    const leftMargin = 25.7;  
    const rightMargin = 17.5; 
    const pageWidth = doc.internal.pageSize.getWidth();    
    let yPosition = 0;

    // Add logo on the right side
    const img = new Image();
    img.src = 'images/logo.png';

    return new Promise((resolve) => {
        img.onload = function() {
            // Logo dimensions
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

        // Add first and second rows (existing) 
            yPos = table.addRow('11', 'Valuation Note', '', 8, true);
            yPos = table.addRow('a (i) ', 'Mention the value as per Government Approved Rates also', Container_3.govtValue);

            yPos = table.addRow('ii', 'In case of variation of 20 % or more in the valuation proposed by the valuer and the Guideline value provided in the State Govt. notification or Income Tax Gazette justification on variation has to be given',Container_3.variationJustification);
            yPos = table.addRow('b', 'Summary of Valuation', '', 8, true);
            yPos = table.addRow('i', 'Guideline Rate ',Container_3.guidelineRate);
            yPos = table.addRow('ii', 'Market Rate',Container_3.marketRate);

            yPos = table.addRow('iii', 'Land Value ',Container_3.landValue);
            yPos = table.addRow('iv', 'Building Value ',Container_3.buildingValue);
            yPos = table.addRow('v', 'Extra items, Amenities & Services',Container_3.extraItems);
            yPost = table.addRow('vi', 'Fair Market Value (SAY)', Container_3.fairMarketValue);
            yPost = table.addRow('c(vii)', ' Expected Rental Value ', Container_3.rentalValue);

            // Add data rows with all columns        
            yPost = table.addTableHeader();   

            yPos = table.addRow('', 'AS PER ACTUALS', '', 8, true);

            actualsData.forEach((row, index) => {
                const floor = row[Object.keys(row).find(key => key.includes('Floor'))];
                const roofType = row[Object.keys(row).find(key => key.includes('RoofType'))];
                const area = row[Object.keys(row).find(key => key.includes('Area'))];
                const rate = row[Object.keys(row).find(key => key.includes('Rate'))];
                const amount = row[Object.keys(row).find(key => key.includes('Amount'))];
                const deprn = row[Object.keys(row).find(key => key.includes('Deprn'))];
                const deprnAmount = row[Object.keys(row).find(key => key.includes('DeprnAmount'))];
                const netAmount = row[Object.keys(row).find(key => key.includes('NetAmount'))];

                yPos = table.addRowT(index + 1, floor, roofType, area, rate, amount, deprn, deprnAmount, netAmount);
            });

            yPos = table.addRow('', 'AS PER PLAN', '', 8, true);
            planData.forEach((row, index) => {
                const floor = row[Object.keys(row).find(key => key.includes('Floor'))];
                const roofType = row[Object.keys(row).find(key => key.includes('RoofType'))];
                const area = row[Object.keys(row).find(key => key.includes('Area'))];
                const rate = row[Object.keys(row).find(key => key.includes('Rate'))];
                const amount = row[Object.keys(row).find(key => key.includes('Amount'))];
                const deprn = row[Object.keys(row).find(key => key.includes('Deprn'))];
                const deprnAmount = row[Object.keys(row).find(key => key.includes('DeprnAmount'))];
                const netAmount = row[Object.keys(row).find(key => key.includes('NetAmount'))];

                yPos = table.addRowT(index + 1, floor, roofType, area, rate, amount, deprn, deprnAmount, netAmount);
            });
              // Resolve the promise after the table is completed
              resolve(yPos);
            };
        
            img.onerror = function() {
                console.error('Error loading logo');
                resolve(yPos);
            };
            });
}


    // Update the createTable function to accept null title/subtitle
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
            
        const col1Width = 7;
        const col2Width = 85;
        const col3Width = tableWidth - col1Width - col2Width;

        function addRow(number, description, value, height = null, no_column = false) {
            // Calculate text length
           const textLength = description.length + (value ? value.length : 0);
           
           // Split text for measurement
           const splitDescription = doc.splitTextToSize(description, col2Width - 4);
           const splitValue = value ? doc.splitTextToSize(value, col3Width - 4) : [''];
           
           // Get number of lines for both description and value
           const descriptionLines = splitDescription.length;
           const valueLines = splitValue.length;
           
           // Use the maximum number of lines to determine height
           const maxLines = Math.max(descriptionLines, valueLines);
           const lineHeight = 3.5; // Reduced base height per line
           const padding = 1; // Minimum padding
           
           // Calculate height based on content
           let calculatedHeight;
           if (maxLines === 1) {
               calculatedHeight = lineHeight + padding; // Minimum height for single line
           } else {
               calculatedHeight = (maxLines * lineHeight) + padding; // Height for multiple lines
           }
           
           
           // If height parameter is provided, use it as minimum height
           const rowHeight = height ? Math.max(calculatedHeight, height) : calculatedHeight;

           if (no_column) {
               // Draw only two columns when no_column is true
               doc.rect(leftMargin , yPosition, col1Width, rowHeight);
               
               if (number) {
                   doc.setFont('helvetica', 'normal');
                   doc.text(number.toString(), leftMargin + 1, yPosition + 4);
                   doc.rect(leftMargin + col1Width, yPosition, col2Width + col3Width, rowHeight);

               }
               
               // Set bold font for description when no_column is true
               doc.setFont('helvetica', 'bold');
               doc.text(splitDescription, leftMargin + col1Width + 2, yPosition + 4);
           } else {
               // Original three-column layout
               doc.rect(leftMargin, yPosition, col1Width, rowHeight);
               doc.rect(leftMargin + col1Width, yPosition, col2Width, rowHeight);
               doc.rect(leftMargin + col1Width + col2Width, yPosition, col3Width, rowHeight);
               
               if (number) {
                   doc.setFont('helvetica', 'normal');
                   doc.text(number.toString(), leftMargin + 2, yPosition + 3);
               }
               
               doc.setFont('helvetica', 'normal');
               doc.text(splitDescription, leftMargin + col1Width + 2, yPosition + 3);
               
               
               doc.text(splitValue, leftMargin + col1Width + col2Width + 2, yPosition + 3);
           }
           
           yPosition += rowHeight;
           return yPosition;
       }
            
        // Define column widths (adjusted for 9 columns)
        const colWidths = {
            slNo: 7,
            particulars: 24,
            roof: 12,
            area: 17,
            rate: 15,
            amountIn: 26,
            deprnIn: 14,
            deprnAmount: 25,
            netAmount: 29
        };

        function addTableHeader(){
            yPosition += 6;
            // Add title
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(10);
            doc.text('BUILDING VALUE:', leftMargin, yPosition);
            yPosition += 2;
                // Header row
            doc.setFontSize(7);
            doc.rect(leftMargin, yPosition, colWidths.slNo, 10);
            doc.text('SL\nNo.', leftMargin + 1, yPosition + 4);
            
            let xPos = leftMargin + colWidths.slNo;
            doc.rect(xPos, yPosition, colWidths.particulars, 10);
            doc.text('PARTICULARS', xPos + 2, yPosition + 6);
            
            xPos += colWidths.particulars;
            doc.rect(xPos, yPosition, colWidths.roof, 10);
            doc.text('ROOF', xPos + 2, yPosition + 6);
            
            xPos += colWidths.roof;
            doc.rect(xPos, yPosition, colWidths.area, 10);
            doc.text('AREA IN\nSFT', xPos + 2, yPosition + 4);
            
            xPos += colWidths.area;
            doc.rect(xPos, yPosition, colWidths.rate, 10);
            doc.text('RATE IN\nRs', xPos + 2, yPosition + 4);
            
            xPos += colWidths.rate;
            doc.rect(xPos, yPosition, colWidths.amountIn, 10);
            doc.text('AMOUNT IN\nRs', xPos + 2, yPosition + 4);
            
            xPos += colWidths.amountIn;
            doc.rect(xPos, yPosition, colWidths.deprnIn, 10);
            doc.text('DEPRN\nIN %', xPos + 2, yPosition + 4);
            
            xPos += colWidths.deprnIn;
            doc.rect(xPos, yPosition, colWidths.deprnAmount, 10);
            doc.text('DEPRN\nAMOUNT', xPos + 2, yPosition + 4);
            
            xPos += colWidths.deprnAmount;
            doc.rect(xPos, yPosition, colWidths.netAmount, 10);
            doc.text('NET\nAMOUNT', xPos + 2, yPosition + 4);

            yPosition += 10;  
            }
       
        // Function to add a row
        function addRowT(slNo, particulars, roof, area, rate, amountIn, deprnIn, deprnAmount, netAmount) {
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(7);            
            let xPos = leftMargin;
            doc.rect(xPos, yPosition, colWidths.slNo, 7);
            if(slNo) doc.text(slNo.toString(), xPos + 1, yPosition + 4);
            
            xPos += colWidths.slNo;
            doc.rect(xPos, yPosition, colWidths.particulars, 7);
            doc.text(particulars, xPos + 1, yPosition + 4);
            
            xPos += colWidths.particulars;
            doc.rect(xPos, yPosition, colWidths.roof, 7);
            doc.text(roof, xPos + 1, yPosition + 4);
            
            xPos += colWidths.roof;
            doc.rect(xPos, yPosition, colWidths.area, 7);
            if(area) doc.text(area.toString(), xPos + 1, yPosition + 4);
            
            xPos += colWidths.area;
            doc.rect(xPos, yPosition, colWidths.rate, 7);
            if(rate) doc.text(rate.toString(), xPos + 1, yPosition + 4);
            
            xPos += colWidths.rate;
            doc.rect(xPos, yPosition, colWidths.amountIn, 7);
            if(amountIn) doc.text(amountIn.toString(), xPos + 1, yPosition + 4);
            
            xPos += colWidths.amountIn;
            doc.rect(xPos, yPosition, colWidths.deprnIn, 7);
            if(deprnIn) doc.text(deprnIn.toString(), xPos + 1, yPosition + 4);
            
            xPos += colWidths.deprnIn;
            doc.rect(xPos, yPosition, colWidths.deprnAmount, 7);
            if(deprnAmount) doc.text(deprnAmount.toString(), xPos + 1, yPosition + 4);
            
            xPos += colWidths.deprnAmount;
            doc.rect(xPos, yPosition, colWidths.netAmount, 7);
            if(netAmount) doc.text(netAmount.toString(), xPos + 1, yPosition + 4);
            
            yPosition += 7;
            return yPosition;
        }
    return {  
        addTableHeader,      
        addRow,
        addRowT,
        getPosition: () => yPosition
    };
}
 
async function generatePDF() {
   const { jsPDF } = window.jspdf;
   const doc = new jsPDF();
   
   await Container3(doc, Container_3)
   addFooter(doc)
   return doc;
}