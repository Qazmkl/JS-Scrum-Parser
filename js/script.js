$(document).ready(function () {
    $("h2").click(function () {
        $(this).hide();
    })
    $("#submitButton").click(function () {
        // Reset space above button reserved for error messages
        $("#errorText").remove();
        $("<br id=\"placeholderSpace\" />").appendTo("#errorParagraph");

        // Check if the text areas are empty
        if ($.trim($("#today").val()) != "" && $.trim($("#yesterday").val()) != "") {
            try {
                // Final result string
                var result = "Defects @\nAssigned To\tNo\tYes\tGrand Total\n";

                // Excel tables split into lines
                var allLinesYest = $("#yesterday").val().replace(/\r\n/g, "\n").split("\n");
                var allLinesToday = $("#today").val().replace(/\r\n/g, "\n").split("\n");

                // Getting information on the people (number, starting index, names)
                var numOfPeopleYest = 0;
                var peopleYestIndex = [];
                var peopleYestNames = [];
                for (i = 0; i < allLinesYest.length; i++) {
                    if (allLinesYest[i].split("\t")[0].length > 0) {
                        numOfPeopleYest++;
                        peopleYestIndex.push(i);

                        // Checking for '(empty)'
                        if (allLinesYest[i].split("\t")[0].split(":")[1].split("(")[0].trim() != "") {
                            peopleYestNames.push(allLinesYest[i].split("\t")[0].split(":")[1].split("(")[0].trim());
                        } else {
                            peopleYestNames.push("(empty)");
                        }

                    }
                }

                // Storing defect numbers into Hash Table
                var defectYest = {};
                for (i = 0; i < numOfPeopleYest; i++) {
                    defectYest[peopleYestNames[i]] = []
                    var currentTableIndex = peopleYestIndex[i] + 1;
                    var defectIndex = 0;

                    while (currentTableIndex < allLinesYest.length && allLinesYest[currentTableIndex].split("\t")[0].length <= 0) {
                        defectYest[peopleYestNames[i]][defectIndex] = allLinesYest[currentTableIndex].split("\t")[4];
                        currentTableIndex++;
                        defectIndex++;
                    }
                }

                // Doing the same thing for today's scrum
                var numOfPeopleToday = 0;
                var peopleTodayIndex = [];
                var peopleTodayNames = [];
                for (i = 0; i < allLinesToday.length; i++) {
                    if (allLinesToday[i].split("\t")[0].length > 0) {
                        numOfPeopleToday++;
                        peopleTodayIndex.push(i);

                        if (allLinesToday[i].split("\t")[0].split(":")[1].split("(")[0].trim() != "") {
                            peopleTodayNames.push(allLinesToday[i].split("\t")[0].split(":")[1].split("(")[0].trim());
                        } else {
                            peopleTodayNames.push("(empty)");
                        }
                    }
                }

                var defectToday = {};
                for (i = 0; i < numOfPeopleToday; i++) {
                    defectToday[peopleTodayNames[i]] = []
                    var currentTableIndex = peopleTodayIndex[i] + 1;
                    var defectIndex = 0;

                    while (currentTableIndex < allLinesToday.length && allLinesToday[currentTableIndex].split("\t")[0].length <= 0) {
                        defectToday[peopleTodayNames[i]][defectIndex] = allLinesToday[currentTableIndex].split("\t")[4];
                        currentTableIndex++;
                        defectIndex++;
                    }
                }

                // Comparing defects
                var defectYestNum = {};
                var defectTodayNum = {};
                var defectTotal = {};
                var defectYestTotal = 0;
                var defectTodayTotal = 0;
                var defectGrandTotal = 0;

                for (var assignee in defectToday) {
                    defectYestNum[assignee] = 0;
                    defectTodayNum[assignee] = 0;
                    defectTotal[assignee] = 0;
                    
                    for (i = 0; i < defectToday[assignee].length; i++) {                        
                        if (defectYest[assignee] != null && defectYest[assignee].indexOf(defectToday[assignee][i]) == -1) {
                            defectTodayNum[assignee]++;
                            defectTodayTotal++;
                        } else {
                            defectYestNum[assignee]++;
                            defectYestTotal++;
                        }
                        
                        defectTotal[assignee]++;
                        defectGrandTotal++;
                    }
                    
                    // Adding assignee to the result string
                    result += assignee + "\t" + defectYestNum[assignee] + "\t" + defectTodayNum[assignee] + "\t" + defectTotal[assignee] + "\n";
                }
                
                // Adding the grand total line to the result string
                result += "Grand Total\t" + defectYestTotal + "\t" + defectTodayTotal + "\t" + defectGrandTotal;

                $("#ScrumUI").hide();
                $("#result").add("<div class=\"container\"><h3>Result:</h3><textarea rows=30 cols=160>" + result + "</textarea><p><br/>Parsing Succssful!!<br/>Copy and paste the result into a new Excel file.<br/><br/>Refresh the page to parse more excel files!</p></div").appendTo(document.body);
            } catch (e) {
                // Error message for wrong format
                if ($("#errorText").length <= 0) {
                    $("#placeholderSpace").remove();
                    $("<p style=\"color: red;\" id=\"errorText\">Excel files are not in correct format</p>").appendTo("#errorParagraph");
                }
            }
        } else {
            // Error message for emtpy space
            if ($("#errorText").length <= 0) {
                $("#placeholderSpace").remove();
                $("<p style=\"color: red;\" id=\"errorText\">Please fill in both text areas before submitting</p>").appendTo("#errorParagraph");
            }
        }
    })
})