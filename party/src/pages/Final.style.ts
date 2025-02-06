import styled from "styled-components";

export const Style = {
  Container: styled.div`
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 24px;
  `,
  Header: styled.header`
    text-align: center;
    margin-bottom: 48px;
  `,
  Title: styled.h1`
    font-size: 32px;
    font-weight: 700;
    margin-bottom: 16px;
    color: #333;
  `,
  Subtitle: styled.p`
    font-size: 18px;
    color: #666;
  `,
  List: styled.ul`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 24px;
    list-style: none;
    padding: 0;
    margin: 0;
  `,
  ListItem: styled.li`
    a {
      text-decoration: none;
      color: inherit;
    }
  `,
  Card: styled.div`
    background: white;
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: all 0.2s ease-in-out;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    }
  `,
  ProfileSection: styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 16px;
  `,
  ProfileImage: styled.img`
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
  `,
  ProfileInfo: styled.div`
    flex: 1;
  `,
  Name: styled.h2`
    font-size: 20px;
    font-weight: 600;
    margin: 0 0 8px 0;
  `,
  Info: styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-size: 14px;
    color: #666;
  `,
  ViewButton: styled.button`
    width: 100%;
    padding: 12px;
    background: #ff6b6b;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s ease;

    &:hover {
      background: #ff5252;
    }
  `,
  LoadingWrapper: styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    font-size: 18px;
    color: #666;
  `,
  GallerySection: styled.section`
    margin-bottom: 48px;
  `,
  GalleryTitle: styled.h2`
    font-size: 24px;
    font-weight: 600;
    text-align: center;
    margin-bottom: 24px;
    color: #333;
  `,
  ImageGrid: styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
    margin-top: 24px;
  `,
  ImageCard: styled.div`
    position: relative;
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s ease;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    }
  `,
  Image: styled.img`
    width: 100%;
    height: 250px;
    object-fit: cover;
  `,
  UploadSection: styled.div`
    text-align: center;
    margin: 24px 0;
  `,
  UploadButton: styled.button`
    background: #4caf50;
    color: white;
    padding: 12px 24px;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s ease;

    &:hover {
      background: #45a049;
    }

    &:disabled {
      background: #ccc;
      cursor: not-allowed;
    }
  `,
  FileInput: styled.input`
    display: none;
  `,
  DownloadButton: styled.a`
    position: absolute;
    bottom: 12px;
    right: 12px;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 8px 16px;
    border-radius: 6px;
    text-decoration: none;
    font-size: 14px;
    transition: background 0.2s ease;

    &:hover {
      background: rgba(0, 0, 0, 0.9);
    }
  `,
};
