import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
import pandas as pd
import numpy as np
import pprint

# My Functions and Variables
# Erik Roosendahl, e.roosendahl@wustl.edu
# Referenced material linked in jupyter notebook.
#     (* except for specified instructor/class provided functions at the bottom)

# My variables:
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#


big_bang = 1543212000   # timestamp for November 26, 2018, the earliest date in the dataset
minimum_visibility = 0.717
maximum_visibility = 10

destination_color_dict = {
    'Haymarket Square': 'tab:blue',
    'Back Bay': 'tab:orange',
    'North End': 'tab:green',
    'North Station': 'tab:red',
    'Beacon Hill': 'tab:purple',
    'Boston University': 'tab:brown',
    'Fenway': 'tab:pink',
    'South Station': 'tab:gray',
    'Theatre District': 'tab:olive',
    'West End': 'tab:cyan',
    'Financial District': 'maroon',
    'Northeastern University': 'navy',
}

destination_marker_dict = {
    'Haymarket Square': 'o',
    'Back Bay': 'v',
    'North End': '^',
    'North Station': '<',
    'Beacon Hill': '>',
    'Boston University': 's',
    'Fenway': 'p',
    'South Station': 'P',
    'Theatre District': '*',
    'West End': 'X',
    'Financial District': 'D',
    'Northeastern University': '+',
}


short_weather_summary_color_dict = {
    ' Mostly Cloudy ': 'black',
    ' Rain ': 'blue',
    ' Clear ': 'yellow',
    ' Partly Cloudy ': 'lightsteelblue',
    ' Overcast ': 'slategrey',
    ' Possible Drizzle ': 'plum',
    ' Light Rain ': 'lightskyblue',
    ' Foggy ': 'peachpuff',
    ' Drizzle ': 'cyan',
}

visibility_categorical_color_dict = {
    "Almost none": 'red',
    "Bad": 'grey',
    "Okay": 'plum',
    "Decent": 'lightsteelblue',
    "Good": 'cornflowerblue',
    "Fantastic": 'aqua',
}

All_vizualization_color_patches =  [mpatches.Patch(color = 'red', label = 'Almost None'),         \
                                mpatches.Patch(color = 'grey', label = 'Bad'),                    \
                                mpatches.Patch(color = 'plum', label = 'Okay'),                   \
                                mpatches.Patch(color = 'lightsteelblue', label = 'Decent'),       \
                                mpatches.Patch(color = 'cornflowerblue', label = 'Good'),         \
                                mpatches.Patch(color = 'aqua', label = 'Fantastic')              \
                                ]

# My functions:
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#

# takes in a pandas series of strings of datetimes (in the format in this original data specifically)
# and creates an array of the time in seconds from the start of that day
def datetime_to_seconds(datetime_series):
    result = []
    for entry in datetime_series:
        entry = entry[11:19]
        hours = entry[0:2]
        minutes = entry[3:5]
        seconds = entry[6:8]
        time_in_seconds = int(hours)*3600 + int(minutes)*60 + int(seconds)
        result.append(time_in_seconds)
    return result 

# takes a series of times (in seconds) and returns a series the same length with categorical times of day as their values
def time_of_day_to_categorical(time_of_day_series):
    result = []
    for entry in time_of_day_series:
        if entry < 28799:                   
            result.append("Morning")
        elif entry < 57599:
            result.append("Mid-day")
        else:
            result.append("Evening")
    return result

# MORE CATEGORIES
def time_of_day_to_categorical_MORE_CATEGORIES(time_of_day_series):
    result = []
    for entry in time_of_day_series:
        if entry < 14400:                    # 00:00:00 - 03:59:59
            result.append("Pre-morning")
        elif entry < 28800:                  # 04:00:00 - 07:59:59
            result.append("Early Morning")
        elif entry < 43200:                  # 08:00:00 - 11:59:59
            result.append("Late Morning")
        elif entry < 57600:                  # 12:00:00 - 15:59:59
            result.append("Afternoon")
        elif entry < 72000:                  # 16:00:00 - 19:59:59
            result.append("Evening")
        else:                                # 20:00:00 - 23:59:59
            result.append("Nighttime")
    return result

# passed a visibility series, returns a matching series, with the numerical values assigned to ordinal categories for visibility, as seen below.
# categories: [ "Almost none", "Bad", "Okay", "Decent", "Good", "Fantastic"]
def visibility_to_categorical(visibility_series):
    maximum_visibility = 10
    result = []
    threshhold = maximum_visibility/6
    for entry in visibility_series:
        if entry < threshhold:                    # 00:00:00 - 03:59:59
            result.append("Almost none")
        elif entry < threshhold*2:                  # 04:00:00 - 07:59:59
            result.append("Bad")
        elif entry < threshhold*3:                  # 08:00:00 - 11:59:59
            result.append("Okay")
        elif entry < threshhold*4:                  # 12:00:00 - 15:59:59
            result.append("Decent")
        elif entry < threshhold*5:                  # 16:00:00 - 19:59:59
            result.append("Good")
        else:                                # 20:00:00 - 23:59:59
            result.append("Fantastic")
    return result
    

# Returns an array of counts of matching data points originating from the same source, with matching time_of_day and destinations
def generate_source_specific_destination_distributions (source_specific_data): # (< - note this data is already wrangled into source-specific structures)
    data = source_specific_data  # just for readability
    this_destination_distributions = []
    all_destination_distributions = []
    dict_attempt = {}
    
    for unique_destination in data.destination.unique():
        for unique_time_of_day in data.time_of_day_categorical.unique():
            matching_data_points = data[(data.time_of_day_categorical == unique_time_of_day) & (data.destination == unique_destination)]
            this_destination_distributions.append(len(matching_data_points))
        all_destination_distributions.append(this_destination_distributions)
        this_destination_distributions = []
    return all_destination_distributions


# Renerates a dict, mapping destination names to an array of all rides from our source to that destination, split according to categorical variables for time_of_day, specific to 1 source location, 
def generate_source_specific_destination_distributions_dict (source_specific_data): # (< - note this data is already wrangled into source-specific structures)
    data = source_specific_data
    this_destination_distributions = []
    all_destination_distributions = []
    dict_attempt = {}
    
    for unique_destination in data.destination.unique():
        for unique_time_of_day in data.time_of_day_categorical.unique():
            matching_data_points = data[(data.time_of_day_categorical == unique_time_of_day) & (data.destination == unique_destination)]
            this_destination_distributions.append(len(matching_data_points))
        dict_attempt[unique_destination] = this_destination_distributions
        this_destination_distributions = []
    return dict_attempt

# Takes dataframe with rides all from the same source, and makes a grouped bar plot for destinations at different times of day
def vizualize_destination_distributions(source_specific_dataframe):
    ssdd = generate_source_specific_destination_distributions(source_specific_dataframe)      # <- ssdd = "source specific destination distributions"
    ssdd_map = generate_source_specific_destination_distributions_dict(source_specific_dataframe)
    # i wrote this function before i switched from ssdd array to ssdd_map, so I left code like the line below that just worked with ssdd array, even tough I probably could implement it to work off the map instead.
    bins_per_this_ssdd = len(ssdd[0])  # <- equal to the number of categories of time of day
    bin_indexer = np.arange(bins_per_this_ssdd)
    width = 0.15  # how to adjust this to this specific ssbb?
    
    i = 0
    bar_dict = {}
    for destination in ssdd_map:
        bar_dict[destination] = plt.bar(bin_indexer+(width*i), ssdd_map.get(destination), width, color = destination_color_dict[destination])
        i = i+1
    
    source = source_specific_dataframe.source.unique()[0]
    time_of_day_CATEGORIES = ["Pre-morning", "Early Morning", "Late Morning", "Afternoon", "Evening", "Nighttime"]
    
    plt.title(source + " Ride Destination Distributions Relative to Categorical Time of Day")
    plt.xticks(bin_indexer+width, time_of_day_CATEGORIES) 
    plt.xlabel("Time of Day (Categorical)")
    plt.ylabel("Trips made (# of unique rides)")
    plt.rcParams["figure.figsize"]= (12,12)
    plt.legend( bar_dict.values(), bar_dict.keys())
    plt.show()

# Creates and shows a scatter plot comparing date (in seconds since earliest date in dataset) with the price of rides, and color codes the points according to the "short_summary" weather summary feature.
def date_vs_price_vs_weather(source_specific_dataframe): 
    summary_specific_dataFrames = [source_specific_dataframe[source_specific_dataframe.short_summary == " Mostly Cloudy "], \
                                   source_specific_dataframe[source_specific_dataframe.short_summary == " Rain "], \
                                   source_specific_dataframe[source_specific_dataframe.short_summary == " Clear "], \
                                   source_specific_dataframe[source_specific_dataframe.short_summary == " Partly Cloudy "], \
                                   source_specific_dataframe[source_specific_dataframe.short_summary == " Overcast "], \
                                   source_specific_dataframe[source_specific_dataframe.short_summary == " Possible Drizzle "], \
                                   source_specific_dataframe[source_specific_dataframe.short_summary == " Light Rain "], \
                                   source_specific_dataframe[source_specific_dataframe.short_summary == " Foggy "], \
                                   source_specific_dataframe[source_specific_dataframe.short_summary == " Drizzle "] ]
    bar_dict = {}
    for df in summary_specific_dataFrames:
        weather_summary = df.short_summary.unique()[0]
        bar_dict[weather_summary] = plt.scatter(df.adjusted_timestamp, df.price, color = short_weather_summary_color_dict[weather_summary])
    
    source = source_specific_dataframe.source.unique()[0]
    plt.title(source + " Date vs Price vs Weather Summary")
    plt.xlabel("Time since earliest date in dataset (seconds)")
    plt.ylabel("Price of Rides ($)")
    plt.rcParams["figure.figsize"]= (12,12)
    plt.legend( bar_dict.values(), bar_dict.keys())
    plt.show()

# Creates and shows a scatter plot comparing date (in seconds since earliest date in dataset) with the Price of rides, and color codes the points according to the "visibility_categorical" feature I created and added during early data wrangling
def date_vs_price_vs_visibility(source_specific_dataframe): 
    # get category labels
    # iterate through and split the data 
    visibility_categories = source_specific_dataframe.visibility_categorical.unique()
    visibility_specific_dataFrames = []
    
    for category in visibility_categories:
        visibility_specific_dataFrames.append(source_specific_dataframe[source_specific_dataframe.visibility_categorical == category])
    
    bar_dict = {}
    for df in visibility_specific_dataFrames:
        weather_summary = df.visibility_categorical.unique()[0] 
        bar_dict[weather_summary] = plt.scatter(df.adjusted_timestamp, df.price, color = visibility_categorical_color_dict[weather_summary])
    
    source = source_specific_dataframe.source.unique()[0]
    plt.title(source + " Date vs Price vs Visibility Categorical")
    plt.xlabel("Time since earliest date in dataset (seconds)")
    plt.ylabel("Price of Rides ($)")
    plt.rcParams["figure.figsize"]= (12,12)
    plt.legend( bar_dict.values(), bar_dict.keys())
    plt.show()



# Creates and displays a scatter plat for the source_specific data it is passed, that compares date on the x-axis, price on the y-axis, visibility through color coding, and destinations through shapes.
def date_vs_price_vs_visibility_vs_destination(source_specific_dataframe): 

    visibility_categories = source_specific_dataframe.visibility_categorical.unique()
    visibility_specific_dataFrames = []
    
    for category in visibility_categories:
        visibility_specific_dataFrames.append(source_specific_dataframe[source_specific_dataframe.visibility_categorical == category])
    
    visibility_dict = {}
    destination_dict = {}
    destination_and_visibility_specific_dataFrames = []
    
    for df in visibility_specific_dataFrames:
        visibility_category = df.visibility_categorical.unique()[0] # these are vis_category specific already, so this just gets the relevant visibility category
        unique_destinations = df.destination.unique()
        for ud in unique_destinations:
            destination_and_visibility_specific_dataFrames.append(df[df.destination == ud])
            # so now for this vis_specific_df i have a list of all dfs destination specific, so let's plot it with our colors and markers
        for ds_df in destination_and_visibility_specific_dataFrames:
            specific_destination = ds_df.destination.unique()[0]
            destination_dict[specific_destination] = plt.scatter(ds_df.adjusted_timestamp, ds_df.price, color = visibility_categorical_color_dict[ds_df.visibility_categorical.unique()[0]], label = specific_destination, marker = destination_marker_dict[specific_destination])
    
        visibility_dict[visibility_category] = destination_dict
        destination_dict = {}
    
    source = source_specific_dataframe.source.unique()[0]  
    these_destinations_markers = []
    these_visibility_colors = []
    for ud in source_specific_dataframe.destination.unique():
        these_destinations_markers.append(destination_marker_dict[ud])
        
    for uvc in source_specific_dataframe.visibility_categorical.unique():
        these_visibility_colors.append(visibility_categorical_color_dict[uvc])

    visibility_patches = generate_source_specific_patches(source_specific_dataframe.visibility_categorical, visibility_categorical_color_dict)
    
    plt.xlabel("Time since earliest date in dataset (seconds)")
    plt.ylabel("Price of Rides ($)")
    plt.legend(handles = visibility_patches)

    if (len(source_specific_dataframe)<25000):
        plt.title(source + " Date vs Price vs Visibility vs Destination OUTLIERS")
    
    else :
        # plt components according to full ssdds
        plt.title(source + " Date vs Price vs Visibility vs Destination")
        #plt.legend( source_specific_dataframe.visibility_categorical.unique(), these_visibility_colors)
        
    plt.show()

# This function simply slices the data according to a threshhold to only look at outliers outside of that threshhold, then calls the above function to create a nice Date vs Price vs Visibility vs Destination scatter plot for the outliers of that source specific data set.
def vizualize_dpvd_outliers(source_specific_dataframe, threshhold):
    ssdf_outliers_df = source_specific_dataframe[source_specific_dataframe.price > threshhold]
    date_vs_price_vs_visibility_vs_destination(ssdf_outliers_df)
    
# Simply counts the frequency of destinations in the outlier data.  
def count_outlier_destinations(source_specific_dataframe, threshhold):
    ssdf_outliers_df = source_specific_dataframe[source_specific_dataframe.price > threshhold]
    dest_counts = {}
    for ud in ssdf_outliers_df.destination.unique():
        dest_counts[ud] = 0
    for d in ssdf_outliers_df.destination:
        temp = dest_counts[d]
        dest_counts[d] = temp + 1
    return dest_counts  


# Generate a list of patches for a legend showing sourceSpecific_series.uniques to their matching value in the passed dict
# I included "patch_type" early, when I thought I could make patches for markers - should remove this code
def generate_source_specific_patches(sourceSpecific_series, my_dict):  # <- 'patch_type' is a string the specify the type of characteristic we are patching (so I mean, color, or shape, etc.)
    relevant_features = sourceSpecific_series.unique()
    patches_list = []
    for unique_feature in relevant_features:
        patches_list.append(mpatches.Patch(color = my_dict[unique_feature], label = unique_feature))
    return patches_list


# The main function for displaying my data analysis, and the final step for my exploration.
# It takes data all originating from the same source and draws 2 visualizations for Date vs Price vs Visibility vs Destination (through the calls to the matching functions found and described above.
# The first visualization displays all the source_specific data, the second shows only the outliers outside of the threshhold argument.
def profile(source_specific_df, threshhold):
    print("Dictionary place-holder for a proper legend (full reasons explained in Roosendahl_2018ULEDA_Functions):")
    print("The symbols correspond to the 'marker' characteristic of a data point on a visualization.")
    print("Therefore this dict is showing the Destinations corresponding to the markers on the plot.")
    pprint.pprint(destination_marker_dict)  # <- non-ideal proper legend substitute
    date_vs_price_vs_visibility_vs_destination(source_specific_df)
    vizualize_dpvd_outliers(source_specific_df, threshhold)
    cod = count_outlier_destinations(source_specific_df, threshhold)
    print(source_specific_df.source.unique()[0], ": Trips per destination = ", cod)
    

#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#
# instructor/class provided function:
def configure_plots():
    '''Configures plots by making some quality of life adjustments'''
    for _ in range(2):
        plt.rcParams['figure.figsize'] = [16, 9]
        plt.rcParams['axes.titlesize'] = 20
        plt.rcParams['axes.labelsize'] = 16
        plt.rcParams['xtick.labelsize'] = 14
        plt.rcParams['ytick.labelsize'] = 14
        plt.rcParams['lines.linewidth'] = 2
