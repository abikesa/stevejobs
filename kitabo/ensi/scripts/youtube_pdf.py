import re
from fpdf import FPDF

# Initialize PDF
pdf = FPDF()
pdf.add_page()
pdf.set_font("Arial", size=12)

# Comments to be added to the PDF
comments = """
Be one of the first subscribers to the podcast! https://bit.ly/SubscribeToWhatNowPodcast  🙌:stayhome: What are your thoughts on the episode?
Short-term greed, call it what it is, it is theft.
Intriguing! An unfinished discussion...
Trevor navigates the beautiful and grotesque facets of life through the lens of humor... had me laughing in the pandemic.
Simon is a philosopher-explorer climbing a mountain whose peak is undiscovered and out of sight... continues to inspire me.
Trevor and Simon, I love you both but I had to stop listening to this because you endlessly interrupt this woman trying to get her point across. You don't interrupt each other in the same way at all. I gave up after 26mins because it just made me angry. Give her the grace to speak as you do each other!!!
Surprisingly, this interview fell a bit short for me. But I appreciated Christiana's viewpoint and felt seen. Thank you to Christiana, Trevor and crew for your work in putting these together.
2 of my favorite people, 2 times in a week together. Outstanding 😊
"""  # Truncated for brevity

# Remove unsupported characters
comments_cleaned = re.sub(r'[^\x00-\x7F]+', '', comments)

try:
    # Add comments to the PDF
    for line in comments_cleaned.split('\n'):
        pdf.multi_cell(0, 10, txt=line)

    # Save PDF
    output_file = "/mnt/data/youtube_comments.pdf"
    pdf.output(output_file)
    print(f"PDF successfully created: {output_file}")

except Exception as e:
    print(f"An error occurred: {e}")

