import pandas as pd
import re
import os
import json
import ast

directory = os.path.dirname(os.path.dirname(__file__))

SONGS_CSV_PATH = os.path.join(directory, 'taylor-swift-lyrics/songs.csv')
ACRONYM_CSV_PATH = 'acronyms.csv'
ACRONYM_JSON_PATH = 'acronyms.json'

def lyrics_to_acronym():
    print('Generating acronyms CSV...')
    song_data = pd.read_csv(SONGS_CSV_PATH)
    lyric_records = []
    song_titles = []
    for song in song_data.to_records(index=False):
        title, album, lyrics = song
        if title not in song_titles:
            song_titles.append(title)
            if title == "ME!":
                lyrics = lyrics.replace("[Bridge: Brendon Urie, Taylor Swift, Both]\nGirl, there ain't no \"I\" in \"team\"",
                               "[Bridge: Brendon Urie, Taylor Swift, Both]\nHey, kids! Spelling is fun!\nGirl, there ain't no \"I\" in \"team\"")
            lyric_acronym, lyric_array = get_acronym(lyrics)
            lyric_record = {
                'Song': title,
                'Album': album,
                'Lyric': lyric_array,
                'Acronym': lyric_acronym
                }
            lyric_records.append(lyric_record)
    lyric_df = pd.DataFrame.from_records(lyric_records)
    lyric_df.to_csv(ACRONYM_CSV_PATH, index=False)
        
def get_acronym(lyrics):
    lines = lyrics.split('\n')
    acronym = ''
    words_array = []
    for i in range(len(lines)):
        curr_line = lines[i].strip()
        if curr_line:
            if curr_line[0] != '[' :
                words = curr_line.split(' ')
                for word in words:
                    word_alpha = re.sub(r'[^\w]','',word)
                    if word_alpha:                        
                        acronym += word_alpha[0].upper()
                        words_array.append(word)
    return acronym, words_array

def acronyms_to_json():
    print('Generating acronyms JSON...')
    song_dict = {}
    acronym_data = pd.read_csv(ACRONYM_CSV_PATH)
    for song in acronym_data.to_records(index=False):
        title, album, lyric, acronym = song
        if album != album: # handling for NaN
            album = title
        if album not in song_dict:
            song_dict[album] = {}
        if title not in song_dict[album]:
            song_dict[album][title] = []
        song_dict[album][title].append({
            'lyric': 
            ast.literal_eval(lyric),
            'acronym':
            acronym,
        })
    acronym_json = json.dumps(song_dict, indent=4)
    with open(ACRONYM_JSON_PATH, 'w') as f:
        f.write(acronym_json)
        f.close()

def main():
    lyrics_to_acronym()
    acronyms_to_json()

if __name__ == '__main__':
    main()