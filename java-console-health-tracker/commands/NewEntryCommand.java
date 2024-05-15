package commands;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Scanner;
import java.util.stream.Collectors;

import main.CommandPrompt;
import main.HealthTrackerGeneralVariables;
import main.HealthTrackerGeneralVariables.endState;
import main.User;

public class NewEntryCommand extends AbstractCommand{
	String entryIdentifier;
	String entryValue;
	String entryDate;
	User currentUser;
	String filePath;

	public NewEntryCommand(CommandPrompt cp) {
		name = "newEntry";
		commandPrompt = cp;
	}

	@Override
	public int execute() {
		System.out.println("newEntry requires arguments.");
		System.out.println(descriptionMessage());
		System.out.println(formatMessage());
		return endState.SUCCESS.value();
	}

	// can add values but not subtract them
	@Override
	public int execute(String executionMod) {
		System.out.println("Executing NewEntryCommand");

		currentUser = commandPrompt.getCurrentUser();
		filePath = commandPrompt.getFile();

		String[] commandSections = executionMod.split(" ");

		if (commandSections.length != 3) {
			System.out.println("There should be exactly 3 arguments.");
			System.out.println(formatMessage());
		} else {

			this.entryDate = commandSections[0];
			this.entryIdentifier = commandSections[1];
			this.entryValue = commandSections[2];


			if (HealthTrackerGeneralVariables.isAlphaNumeric(entryIdentifier) && HealthTrackerGeneralVariables.isNumeric(entryValue)
					&& HealthTrackerGeneralVariables.isValidDate(entryDate)) {
				try {
					readAndWriteCSV();
				} catch(Exception ex) {
					ex.printStackTrace();
				}
			} else { 
				System.out.println("Error: at least one argument is invalid."); 
				System.out.println(formatMessage());
				}
		}

		return 0;
	}

	private void readAndWriteCSV() throws FileNotFoundException, IOException {
		// https://stackoverflow.com/questions/13741751/modify-the-content-of-a-file-using-java
		List<String> lines = new ArrayList<String>();

		boolean found = readFromCSV(lines); 
		if (!found) { System.out.println("Error finding User position"); }
		else {
			writeToCSV(lines);
		}
	}

	private boolean readFromCSV(List<String> lines) throws FileNotFoundException, IOException {
		File csvFile = new File(this.filePath);
		FileReader csvReader = new FileReader(csvFile);
		BufferedReader csvBufferedReader = new BufferedReader(csvReader);
		String line = null;
		boolean found = false;

		while ((line = csvBufferedReader.readLine()) != null) {
			String[] userEntries = line.split(",");

			if (userEntries[0] != "" && userEntries[0].equals(this.currentUser.getName())) { 
				found = true;
				boolean foundDate = false;
				foundDate = editExistingDate(userEntries, foundDate);

				// https://stackoverflow.com/questions/1978933/a-quick-and-easy-way-to-join-array-elements-with-a-separator-the-opposite-of-sp
				line = reassembleUserLine(userEntries, foundDate);
			}

			lines.add(line);
		}
		csvReader.close();
		csvBufferedReader.close();
		return found;
	}

	private void writeToCSV(List<String> lines) throws IOException {
		FileWriter csvWriter = new FileWriter(this.filePath);
		BufferedWriter csvBufferedWriter = new BufferedWriter(csvWriter);

		for (String csvLine : lines) { csvBufferedWriter.write(csvLine + "\n"); }
		csvBufferedWriter.flush();
		csvWriter.close();
		csvBufferedWriter.close();
	}

	private boolean editExistingDate(String[] userEntries, boolean foundDate) {
		for (int i = 1; i < userEntries.length; ++i) {
			String individualEntry = userEntries[i];
			String[] entrySections = individualEntry.split(" ");
			String entrySectionDate = entrySections[0];

			if (entrySectionDate.equals(this.entryDate)) {
				foundDate = true;
				boolean foundActivity = false;

				foundActivity = checkForExistingActivity(entrySections);

				if (foundActivity) { 
					userEntries[i] = String.join(" ", entrySections);
				} else { 
					userEntries[i] = individualEntry + this.entryIdentifier + "(" + this.entryValue + ")" + " ";
				}

				return true;
			}
		}
		return false;
	}

	private boolean checkForExistingActivity(String[] entrySections) {
		for (int j = 1; j < entrySections.length; ++j) {

			String[] activityParts = parseActivityEntry(entrySections[j]);
			String activityID = activityParts[0];
			int activityAmount = Integer.parseInt(activityParts[1]);

			if (activityID.equals(this.entryIdentifier)) {
				int newEntryValue = Integer.parseInt(this.entryValue);
				entrySections[j] = activityID + "(" + Integer.toString(activityAmount + newEntryValue) + ")";
				return true;
			}
		}
		return false;
	}


	private String reassembleUserLine(String[] userEntries, boolean foundDate) {
		String line;
		if (foundDate) {
			line = String.join(",", userEntries);
		} else {
			String[] newUserEntries = new String[userEntries.length+1];

			for (int i = 0; i < userEntries.length; ++i) {
				newUserEntries[i] = userEntries[i];
			}

			newUserEntries[newUserEntries.length-1] = this.entryDate + " "
					+ this.entryIdentifier +  "(" + this.entryValue + ")" + " ";

			line = String.join(",", newUserEntries);
		}
		return line;
	}

	private String[] parseActivityEntry(String activityEntry) {
		int openParenIndex = activityEntry.indexOf("(");
		int closeParenIndex = activityEntry.indexOf(")");

		String activityValue = activityEntry.substring(openParenIndex+1,closeParenIndex);
		String activityId = activityEntry.substring(0,openParenIndex);

		String[] activityParts = new String[] {activityId,activityValue};

		return activityParts;
	}

	@Override
	public String formatMessage() {
		return "newEntry [date-dd/mm/yyyy] [activity-name] [amount]";
	}


	@Override
	public String descriptionMessage() {

		return "Create a new entry on the given date with the given activity and amount.";
	}
}
