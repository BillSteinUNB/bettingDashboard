import streamlit as st
import pandas as pd
import gspread
from oauth2client.service_account import ServiceAccountCredentials
import plotly.express as px

def load_data():
    try:
        scope = ['https://spreadsheets.google.com/feeds',
                 'https://www.googleapis.com/auth/drive']
        
        credentials = ServiceAccountCredentials.from_json_keyfile_name(
            'credentials.json', scope)
        
        client = gspread.authorize(credentials)
        
        # Print available spreadsheets to debug
        spreadsheets = client.list_spreadsheet_files()
        print("Available spreadsheets:", [s['name'] for s in spreadsheets])
        
        # Use the correct spreadsheet ID
        SPREADSHEET_ID = '1rdz20jcWcYfnLu9a5TqkE94w06jYLaFPFD0bsX_6Yao'  # Remove 'Betting' from the end
        sheet = client.open_by_key(SPREADSHEET_ID).sheet1
        
        return pd.DataFrame(sheet.get_all_records())
    
    except Exception as e:
        print(f"Error: {str(e)}")
        return pd.DataFrame()  # Return empty dataframe on error

# Function to create visualizations
def create_charts(df):
    # Profit over time
    fig1 = px.line(df, x='date', y='cumulative_profit', 
                   title='Profit Over Time')
    st.plotly_chart(fig1)
    
    # Win rate by bet type
    fig2 = px.bar(df.groupby('bet_type')['won'].mean().reset_index(),
                  x='bet_type', y='won', title='Win Rate by Bet Type')
    st.plotly_chart(fig2)

def main():
    st.title("Betting Data Dashboard")
    
    # Load data
    df = load_data()
    
    # Sidebar filters
    st.sidebar.header("Filters")
    selected_date = st.sidebar.date_input("Select Date")
    
    # Filter data based on selection
    filtered_df = df[df['date'] == str(selected_date)]
    
    # Display filtered data
    st.dataframe(filtered_df)
    
    # Add metrics
    col1, col2, col3 = st.columns(3)
    with col1:
        st.metric("Total Bets", len(filtered_df))
    with col2:
        st.metric("Win Rate", f"{(filtered_df['won'].mean() * 100):.1f}%")
    with col3:
        st.metric("Net Profit", f"${filtered_df['profit'].sum():.2f}")
    
    # Create visualizations
    create_charts(filtered_df)

if __name__ == "__main__":
    main()