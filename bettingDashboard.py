import streamlit as st
import pandas as pd
import gspread
from oauth2client.service_account import ServiceAccountCredentials
from datetime import datetime, timedelta

def load_data():
    scope = ['https://spreadsheets.google.com/feeds',
             'https://www.googleapis.com/auth/drive']
    
    credentials = ServiceAccountCredentials.from_json_keyfile_name(
        'credentials.json', scope)
    
    client = gspread.authorize(credentials)
    sheet = client.open('Betting ').sheet1
    
    # Specify the headers we expect in row 2
    expected_headers = ['Date', 'Game', 'Bet', 'Sport', 'Odds', 'Units', 
                       'W_L_P', 'POTD', 'Bankroll', 'Unit_Results', 
                       'Leg_or_No', 'Is_Parlay']
    
    data = sheet.get_all_records(head=2, expected_headers=expected_headers)
    df = pd.DataFrame(data)
    df['Date'] = pd.to_datetime(df['Date'])
    
    # Calculate dollar value of results for each bet
    df['Unit_Value'] = df['Bankroll'] * 0.01  # 1% of bankroll at time of bet
    df['Money_WL'] = df['Unit_Results'] * df['Unit_Value']  # Actual money won/lost
    
    return df

def main():
    st.title("Betting Dashboard")
    
    # Manual bankroll input in sidebar
    st.sidebar.header("Bankroll Settings")
    current_bankroll = st.sidebar.number_input("Current Bankroll ($)", value=300.00, step=10.0)
    
    # Load data
    df = load_data()
    
    # Calculate metrics
    total_bets = len(df)
    regular_bets = df[df['W_L_P'].isin(['w', 'l'])]
    wins = len(regular_bets[regular_bets['W_L_P'] == 'w'])
    total_valid_bets = len(regular_bets)
    win_rate = (wins/total_valid_bets * 100) if total_valid_bets > 0 else 0
    
    # Top Level Metrics
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        st.metric("Current Bankroll", f"${current_bankroll:.2f}")
        total_money = df['Money_WL'].sum()
        st.metric("Total Money W/L", f"${total_money:+.2f}")
    
    with col2:
        st.metric("Overall Record", f"{wins}-{total_valid_bets-wins}")
        st.metric("Win Rate", f"{win_rate:.1f}%")
    
    with col3:
        weekly_pl = df[df['Date'] >= pd.Timestamp.now() - pd.Timedelta(days=7)]['Unit_Results'].sum()
        st.metric("Weekly P/L (Units)", f"{weekly_pl:+.2f}")
        total_units = df['Unit_Results'].sum()
        st.metric("Total P/L (Units)", f"{total_units:+.2f}")
    
    with col4:
        st.metric("Total Bets", total_bets)
        potd_bets = df[df['POTD'] == 1]
        potd_wins = len(potd_bets[potd_bets['W_L_P'] == 'w'])
        potd_rate = (potd_wins/len(potd_bets) * 100) if len(potd_bets) > 0 else 0
        st.metric("POTD Win Rate", f"{potd_rate:.1f}%")
    
    # Per Sport Analysis
    st.header("Performance by Sport")
    sports_df = pd.DataFrame()
    for sport in df['Sport'].unique():
        sport_data = df[df['Sport'] == sport]
        sport_wins = len(sport_data[sport_data['W_L_P'] == 'w'])
        sport_valid_bets = len(sport_data[sport_data['W_L_P'].isin(['w', 'l'])])
        sport_winrate = (sport_wins/sport_valid_bets * 100) if sport_valid_bets > 0 else 0
        sport_units = sport_data['Unit_Results'].sum()
        sport_avg_odds = sport_data['Odds'].mean()
        
        sports_df = pd.concat([sports_df, pd.DataFrame({
            'Sport': [sport],
            'Total Bets': [sport_valid_bets],
            'Win Rate': [f"{sport_winrate:.1f}%"],
            'Units P/L': [f"{sport_units:+.2f}"],
            'Avg Odds': [f"{sport_avg_odds:.0f}"]
        })])
    
    # Per Sport Analysis section remains the same until...
    
    # Per Sport Analysis section remains the same until...
    
    st.dataframe(sports_df.set_index('Sport'), use_container_width=True)
    
    # Weekly Performance Analysis
    st.header("Weekly Performance")
    
    # Add week selection
    selected_date = st.date_input("Select any date in the week you want to view")
    week_start = selected_date - timedelta(days=selected_date.weekday())
    week_end = week_start + timedelta(days=6)
    
    # Filter data for selected week
    selected_week = df[(df['Date'].dt.date >= week_start) & (df['Date'].dt.date <= week_end)]
    
    col1, col2 = st.columns(2)
    with col1:
        weekly_wins = len(selected_week[selected_week['W_L_P'] == 'w'])
        weekly_losses = len(selected_week[selected_week['W_L_P'] == 'l'])
        st.metric("Weekly Record", f"{weekly_wins}-{weekly_losses}")
        weekly_win_rate = (weekly_wins/(weekly_wins + weekly_losses) * 100) if (weekly_wins + weekly_losses) > 0 else 0
        st.metric("Weekly Win Rate", f"{weekly_win_rate:.1f}%")
    
    with col2:
        weekly_units = selected_week['Unit_Results'].sum()
        st.metric("Weekly Units W/L", f"{weekly_units:+.2f}")
        avg_weekly_odds = selected_week['Odds'].mean() if not selected_week.empty else 0
        st.metric("Weekly Avg Odds", f"{avg_weekly_odds:.0f}")
    
    # Daily breakdown for selected week
    # Daily breakdown for selected week
    st.subheader(f"Daily Breakdown ({week_start.strftime('%b %d')} - {week_end.strftime('%b %d')})")
    
    # Create complete week dataframe with all days
    all_days = pd.date_range(week_start, week_end, freq='D')
    
    # Group by date first
    daily_results = selected_week.groupby(selected_week['Date'].dt.date).agg({
        'Unit_Results': 'sum',
        'Game': 'count'  # Using Game column to count bets
    }).reset_index()
    
    # Create base dataframe with all days
    all_days_df = pd.DataFrame({
        'Date': all_days.date,
        'Day': all_days.strftime('%A')
    })
    
    # Merge with actual results
    daily_results = pd.merge(
        all_days_df,
        daily_results,
        on='Date',
        how='left'
    )
    
    # Clean up the dataframe
    daily_results = daily_results.fillna(0)
    daily_results.columns = ['Date', 'Day', 'Units W/L', 'Number of Bets']
    
    # Format the date column
    daily_results['Date'] = daily_results['Date'].apply(lambda x: x.strftime('%b %d'))
    
    # Create final display dataframe
    display_df = daily_results[['Day', 'Date', 'Units W/L', 'Number of Bets']]
    
    # Display the dataframe
    st.dataframe(display_df, use_container_width=True)

if __name__ == "__main__":
    main()